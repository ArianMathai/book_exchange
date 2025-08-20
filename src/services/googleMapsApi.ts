// services/googleMapsApi.ts
import { client } from '@/lib/amplifyClient';

// ---------- Types ----------
export interface AddressSuggestion {
    description: string;
    place_id: string;
}

export interface AddressDetails {
    address: string;
    city: string;
    postalCode: string;
    latitude?: number;
    longitude?: number;
}

interface RawAddressDetails {
    address?: string | null;
    city?: string | null;
    postalCode?: string | null;
    latitude?: number | null | undefined;
    longitude?: number | null | undefined;
}

interface CacheEntry<T> { data: T; timestamp: number }

// ---------- Cache (helpers first to avoid HMR/ordering surprises) ----------
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const suggestionsCache = new Map<string, CacheEntry<AddressSuggestion[]>>();
const detailsCache     = new Map<string, CacheEntry<AddressDetails | null>>();

function getCachedData<T>(cache: Map<string, CacheEntry<T>>, key: string): T | null {
    const hit = cache.get(key);
    if (hit && Date.now() - hit.timestamp < CACHE_DURATION) return hit.data;
    cache.delete(key);
    return null;
}
function setCachedData<T>(cache: Map<string, CacheEntry<T>>, key: string, data: T): void {
    cache.set(key, { data, timestamp: Date.now() });
}
function normalizeAddressDetails(data?: RawAddressDetails | null): AddressDetails | null {
    if (!data?.address || !data.city || !data.postalCode) return null;
    return {
        address: data.address,
        city: data.city,
        postalCode: data.postalCode,
        latitude: data.latitude ?? undefined,
        longitude: data.longitude ?? undefined,
    };
}

// ---------- API wrappers ----------
export async function getAddressSuggestions(input: string, types: string[] = ['address']): Promise<AddressSuggestion[]> {
    if (input.length < 3) return [];

    const cacheKey = `sugg:${input.toLowerCase()}:${types.join(',')}`;
    const cached = getCachedData(suggestionsCache, cacheKey);
    if (cached) return cached;

    const res = await client.queries.searchAddresses({ input, types });
    if (res.errors?.length) {
        console.error('searchAddresses errors:', res.errors);
        return [];
    }

    const suggestions = (res.data?.suggestions ?? []) as unknown[];

    // ✅ no `any`, proper narrowing
    const valid = suggestions.filter((s): s is AddressSuggestion => {
        if (!s || typeof s !== 'object') return false;
        const obj = s as Record<string, unknown>;
        return typeof obj.description === 'string' && typeof obj.place_id === 'string';
    });

    setCachedData(suggestionsCache, cacheKey, valid);
    return valid;
}

export async function reverseGeocode(lat: number, lng: number): Promise<AddressDetails | null> {
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        console.error('Invalid coordinates provided to reverseGeocode');
        return null;
    }

    const cacheKey = `rev:${lat.toFixed(6)}:${lng.toFixed(6)}`;
    const cached = getCachedData(detailsCache, cacheKey);
    if (cached !== null) return cached;

    const res = await client.queries.reverseGeocode({ lat, lng });
    if (res.errors?.length) {
        console.error('reverseGeocode errors:', res.errors);
        setCachedData(detailsCache, cacheKey, null);
        return null;
    }

    const normalized = normalizeAddressDetails(res.data as RawAddressDetails | undefined);
    setCachedData(detailsCache, cacheKey, normalized);
    return normalized;
}

export async function getPlaceDetails(place_id: string): Promise<AddressDetails | null> {
    if (!place_id) return null;

    const cacheKey = `place:${place_id}`;
    const cached = getCachedData(detailsCache, cacheKey);
    if (cached !== null) return cached;

    const res = await client.queries.getPlaceDetails({ place_id });
    if (res.errors?.length) {
        console.error('getPlaceDetails errors:', res.errors);
        setCachedData(detailsCache, cacheKey, null);
        return null;
    }

    const normalized = normalizeAddressDetails(res.data as RawAddressDetails | undefined);
    setCachedData(detailsCache, cacheKey, normalized);
    console.log("getPlaceDetails normalized:", normalized);
    return normalized;
}

