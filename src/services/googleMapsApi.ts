// googleMapsApi

import {client} from "@/lib/amplifyClient.ts";

export interface AddressSuggestion {
    description: string;
    place_id: string;
}

export interface AddressDetails {
    address: string;
    city: string;
    postalCode: string;
}

export const fetchGoogleMapsKey = async (): Promise<string | null> => {
    try {
        const result = await client.queries.fetchMapsApiKey();
        return result.data ?? null;
    } catch (error) {
        console.error('❌ Failed to fetch Google Maps API key:', error);
        return null;
    }
};

// Load the Google Maps script if not already present
export const loadGoogleMapsScript = (apiKey: string) => {
    if (!apiKey) {
        console.error("Google Maps API key is missing");
        return;
    }

    if (typeof window.google === 'object') return;

    if (document.getElementById('google-maps-script')) return;

    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
};



// Reverse geocode lat/lng to full address
export const reverseGeocode = async (
    lat: number,
    lng: number
): Promise<AddressDetails | null> => {
    if (!window.google?.maps?.Geocoder) return null;

    const geocoder = new window.google.maps.Geocoder();

    return new Promise((resolve) => {
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status !== 'OK' || !results || !results.length) {
                resolve(null);
                return;
            }

            const components = results[0].address_components;

            const getComponent = (types: string[]) =>
                components.find((c) => types.every((t) => c.types.includes(t)))?.long_name || '';

            const address =
                `${getComponent(['street_number'])} ${getComponent(['route'])}`.trim();

            const city =
                getComponent(['locality']) || getComponent(['administrative_area_level_2']);

            const postalCode = getComponent(['postal_code']);

            resolve({
                address,
                city,
                postalCode,
            });
        });
    });
};
