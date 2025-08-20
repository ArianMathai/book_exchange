// amplify/functions/addressAutocomplete/handler.ts
// Runtime: Node.js 18+ (native fetch)

// ---------- Domain types ----------
export interface AddressSuggestion {
    description: string;
    place_id: string;
}
export interface AddressSearchResult {
    suggestions: AddressSuggestion[];
}
export interface AddressDetails {
    address: string;
    city: string;
    postalCode: string;
    latitude?: number;
    longitude?: number;
}

// ---------- Google API shapes ----------
interface GooglePlacesPrediction {
    description: string;
    place_id: string;
    reference: string;
    matched_substrings: Array<{ length: number; offset: number }>;
    terms: Array<{ offset: number; value: string }>;
    types: string[];
}
interface GooglePlacesAutocompleteResponse {
    predictions: GooglePlacesPrediction[];
    status: string;
    error_message?: string;
}

interface GoogleAddressComponent {
    long_name: string;
    short_name: string;
    types: string[];
}
interface GoogleGeocodingResult {
    address_components: GoogleAddressComponent[];
    formatted_address: string;
    geometry: { location: { lat: number; lng: number } };
}
interface GoogleGeocodingResponse {
    results: GoogleGeocodingResult[];
    status: string;
    error_message?: string;
}
interface GooglePlaceDetailsResponse {
    result: GoogleGeocodingResult;
    status: string;
    error_message?: string;
}

// ---------- Resolver arg types ----------
interface SearchAddressesArgs { input: string; types?: string[] }
interface ReverseGeocodeArgs { lat: number; lng: number }
interface GetPlaceDetailsArgs { place_id: string }
type ArgumentsUnion = SearchAddressesArgs | ReverseGeocodeArgs | GetPlaceDetailsArgs;

// ---------- AppSync event shapes ----------
type FlatAppSyncEvent<A> = {
    typeName: string;
    fieldName: string;
    arguments: A;
    identity?: unknown;
    source?: unknown;
    request?: unknown;
    prev?: unknown;
};
type AwsLambdaAppSyncEvent<A> = {
    info?: { fieldName?: string; typeName?: string };
    arguments: A;
};
type AnyAppSyncEvent<A> = FlatAppSyncEvent<A> | AwsLambdaAppSyncEvent<A>;

function getFieldName<A>(evt: AnyAppSyncEvent<A>): string | undefined {
    // Support both shapes without using `any`
    if ('fieldName' in evt && typeof (evt as FlatAppSyncEvent<A>).fieldName === 'string') {
        return (evt as FlatAppSyncEvent<A>).fieldName;
    }
    if ('info' in evt) {
        const i = (evt as AwsLambdaAppSyncEvent<A>).info;
        if (i && typeof i.fieldName === 'string') return i.fieldName;
    }
    return undefined;
}

type ResolverReturn = AddressSearchResult | AddressDetails | null;

// ---------- Handler ----------
export const handler = async (event: AnyAppSyncEvent<ArgumentsUnion>): Promise<ResolverReturn> => {
    const fieldName = getFieldName(event);
    if (!fieldName) throw new Error('Missing fieldName on event');

    const args = event.arguments;

    try {
        switch (fieldName) {
            case 'searchAddresses':
                return await handleAddressSearch(args as SearchAddressesArgs);
            case 'reverseGeocode':
                return await handleReverseGeocode(args as ReverseGeocodeArgs);
            case 'getPlaceDetails':
                return await handlePlaceDetails(args as GetPlaceDetailsArgs);
            default:
                throw new Error(`Unknown field: ${fieldName}`);
        }
    } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        throw new Error(`Failed to process ${fieldName}: ${msg}`);
    }
};

// ---------- Helpers (formatting & extraction) ----------
function pickComponent(components: GoogleAddressComponent[], types: string[]): string {
    const hit = components.find(c => types.every(t => c.types.includes(t)));
    return hit?.long_name ?? '';
}

/**
 * Norwegian-friendly address formatting:
 *   "<route> <street_number>[, <subpremise>]"   e.g., "Enerhauggata 1, H0101"
 * Fallback to `formatted_address` if route/number missing.
 */
function formatAddressNO(result: GoogleGeocodingResult): string {
    const comps = result.address_components;
    const route = pickComponent(comps, ['route']);
    const streetNumber = pickComponent(comps, ['street_number']);
    const subpremise = pickComponent(comps, ['subpremise']); // apt/flat, if present

    if (route && streetNumber) {
        return `${route} ${streetNumber}${subpremise ? `, ${subpremise}` : ''}`;
    }
    return route || streetNumber || result.formatted_address;
}

function deriveCityNO(components: GoogleAddressComponent[]): string {
    return (
        pickComponent(components, ['locality']) ||
        pickComponent(components, ['postal_town']) ||
        pickComponent(components, ['administrative_area_level_2']) ||
        pickComponent(components, ['administrative_area_level_1'])
    );
}

function derivePostalCode(components: GoogleAddressComponent[]): string {
    return pickComponent(components, ['postal_code']);
}

// ---------- Google calls (with localization) ----------
function withNO(url: URL): URL {
    url.searchParams.set('language', 'nb'); // Norwegian Bokmål
    url.searchParams.set('region', 'NO');
    return url;
}

// ---------- Field resolvers ----------
async function handleAddressSearch({ input, types = ['address'] }: SearchAddressesArgs): Promise<AddressSearchResult> {
    if (!input || input.length < 3) return { suggestions: [] };

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) throw new Error('Google Maps API key not configured');

    const url = withNO(new URL('https://maps.googleapis.com/maps/api/place/autocomplete/json'));
    url.searchParams.append('input', input);
    url.searchParams.append('types', types.join('|'));
    url.searchParams.append('components', 'country:no');
    url.searchParams.append('key', apiKey);

    const response = await fetch(url.toString());
    if (!response.ok) throw new Error(`Google Places API HTTP error: ${response.status}`);

    const data: GooglePlacesAutocompleteResponse = await response.json();
    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
        console.error('Google Places API error:', data.status, data.error_message);
        throw new Error(`Google Places API error: ${data.status}`);
    }

    const suggestions: AddressSuggestion[] = (data.predictions ?? [])
        .slice(0, 5)
        .map(p => ({ description: p.description, place_id: p.place_id }));

    return { suggestions };
}

async function handleReverseGeocode({ lat, lng }: ReverseGeocodeArgs): Promise<AddressDetails | null> {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) throw new Error('Google Maps API key not configured');

    const url = withNO(new URL('https://maps.googleapis.com/maps/api/geocode/json'));
    url.searchParams.append('latlng', `${lat},${lng}`);
    url.searchParams.append('key', apiKey);

    const response = await fetch(url.toString());
    if (!response.ok) throw new Error(`Google Geocoding API HTTP error: ${response.status}`);

    const data: GoogleGeocodingResponse = await response.json();
    if (data.status !== 'OK') {
        if (data.status === 'ZERO_RESULTS') return null;
        console.error('Google Geocoding API error:', data.status, data.error_message);
        throw new Error(`Google Geocoding API error: ${data.status}`);
    }

    const result = data.results?.[0];
    if (!result) return null;

    const comps = result.address_components;
    const address = formatAddressNO(result);
    const city = deriveCityNO(comps);
    const postalCode = derivePostalCode(comps);

    return {
        address,
        city,
        postalCode,
        latitude: result.geometry.location.lat,
        longitude: result.geometry.location.lng,
    };
}

async function handlePlaceDetails({ place_id }: GetPlaceDetailsArgs): Promise<AddressDetails> {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) throw new Error('Google Maps API key not configured');

    const url = withNO(new URL('https://maps.googleapis.com/maps/api/place/details/json'));
    url.searchParams.append('place_id', place_id);
    url.searchParams.append('fields', 'address_components,geometry,formatted_address');
    url.searchParams.append('key', apiKey);

    const response = await fetch(url.toString());
    if (!response.ok) throw new Error(`Google Places API HTTP error: ${response.status}`);

    const data: GooglePlaceDetailsResponse = await response.json();
    if (data.status !== 'OK') {
        console.error('Google Places API error:', data.status, data.error_message);
        throw new Error(`Google Places API error: ${data.status}`);
    }

    const result = data.result;
    const comps = result.address_components;

    const address = formatAddressNO(result);
    const city = deriveCityNO(comps);
    const postalCode = derivePostalCode(comps);

    return {
        address,
        city,
        postalCode,
        latitude: result.geometry.location.lat,
        longitude: result.geometry.location.lng,
    };
}
