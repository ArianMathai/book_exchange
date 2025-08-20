// SetupLocationPage.tsx (updated to use Lambda proxy instead of Google Maps widget)

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, LocateFixed, Save, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { getCurrentLocation } from '@/services/getCurrentLocation';
import { upsertUserLocation } from '@/services/upsertUserLocation';
import { fetchUserAttributes } from 'aws-amplify/auth';
import { client } from '@/lib/amplifyClient';
import { reverseGeocode, getAddressSuggestions, AddressSuggestion, getPlaceDetails } from '@/services/googleMapsApi';

const SetupLocationPage = () => {
    const navigate = useNavigate();
    const addressInputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const suppressNextSearchRef = useRef(false);
    const isAddressFocusedRef = useRef(false);


    const [formData, setFormData] = useState({
        address: '',
        city: '',
        postalCode: '',
        latitude: '',
        longitude: ''
    });

    // New state for address autocomplete
    const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

    const [isFetchingLocation, setIsFetchingLocation] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Debounce for address search
    useEffect(() => {

        // Don’t search if we just selected a suggestion
        if (suppressNextSearchRef.current) {
            suppressNextSearchRef.current = false;
            return;
        }

        // Only search when the input is focused (i.e., user is typing)
        if (!isAddressFocusedRef.current) {
            setShowSuggestions(false);
            return;
        }


        const searchAddresses = async () => {
            if (formData.address.length < 3) {
                setAddressSuggestions([]);
                setShowSuggestions(false);
                return;
            }

            setIsLoadingSuggestions(true);
            try {
                const suggestions = await getAddressSuggestions(formData.address, ['address']);
                setAddressSuggestions(suggestions);
                setShowSuggestions(suggestions.length > 0);
            } catch (error) {
                console.error('Failed to fetch address suggestions:', error);
                setAddressSuggestions([]);
            } finally {
                setIsLoadingSuggestions(false);
            }
        };

        const timer = setTimeout(searchAddresses, 300);
        return () => clearTimeout(timer);
    }, [formData.address]);

    // Handle clicking outside to close suggestions
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleAddressSelect = async (suggestion: AddressSuggestion) => {
        // stop the effect from immediately searching again
        suppressNextSearchRef.current = true;
        setShowSuggestions(false);

        // show chosen text immediately
        setFormData(prev => ({ ...prev, address: suggestion.description }));

        try {
            const details = await getPlaceDetails(suggestion.place_id);
            if (details) {
                setFormData(prev => ({
                    ...prev,
                    address: details.address || prev.address,
                    city: details.city || prev.city,
                    postalCode: details.postalCode || prev.postalCode,
                    latitude: details.latitude != null ? String(details.latitude) : prev.latitude,
                    longitude: details.longitude != null ? String(details.longitude) : prev.longitude,
                }));
            } else {
                console.warn('Place details not found for', suggestion.place_id);
            }
        } catch (e) {
            console.error('Failed to get place details:', e);
        }
    };



    const autofillWithCurrentLocation = async () => {
        setIsFetchingLocation(true);
        setError(null);
        try {
            const coords = await getCurrentLocation();
            if (coords) {
                setFormData((prev) => ({
                    ...prev,
                    latitude: coords.latitude.toString(),
                    longitude: coords.longitude.toString()
                }));

                const details = await reverseGeocode(coords.latitude, coords.longitude);
                if (details) {
                    setFormData((prev) => ({
                        ...prev,
                        address: details.address,
                        city: details.city,
                        postalCode: details.postalCode
                    }));
                }
            } else {
                setError('Failed to get location');
            }
        } catch (err) {
            console.error('Error fetching location:', err);
            setError('Location access failed');
        } finally {
            setIsFetchingLocation(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const attributes = await fetchUserAttributes();
            const sub = attributes.sub;
            const email = attributes.email;

            if (!sub || !email) throw new Error('Missing user info');

            // Check if user already exists
            const existing = await client.models.User.get({ sub });

            const userPayload = {
                sub,
                email,
                coordinates: {
                    lat: parseFloat(formData.latitude),
                    long: parseFloat(formData.longitude)
                },
                address: formData.address,
                city: formData.city,
                postalCode: formData.postalCode
            };

            let result;

            if (existing?.data) {
                result = await client.models.User.update(userPayload);
                console.log('✅ User updated:', result);
            } else {
                result = await client.models.User.create(userPayload);
                console.log('✅ User created:', result);
            }

            if (!result?.data) {
                throw new Error('❌ Failed to save user');
            }
            if (formData.latitude && formData.longitude) {
                try {
                    await upsertUserLocation({
                        userId: sub,
                        longitude: parseFloat(formData.longitude),
                        latitude: parseFloat(formData.latitude)
                    });
                } catch (err) {
                    console.error('Failed to upsert user location:', err);
                }
            }

            navigate('/library');
        } catch (err) {
            console.error('Failed to save user location:', err);
            setError('Failed to save your location. Try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50 py-10 px-4">
            <div className="max-w-xl mx-auto">
                <Card className="shadow-lg border-slate-200">
                    <CardHeader>
                        <CardTitle className="text-xl">Set Up Your Location</CardTitle>
                        <CardDescription>
                            Provide your home address to help find books near you.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2 relative">
                                <Label htmlFor="address">Address</Label>
                                <Input
                                    id="address"
                                    ref={addressInputRef}
                                    value={formData.address}
                                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                                    onFocus={() => { isAddressFocusedRef.current = true; }}
                                    onBlur={() => { isAddressFocusedRef.current = false; setShowSuggestions(false); }}
                                    placeholder="123 Main St"
                                    autoComplete="off"
                                />



                                {/* Custom autocomplete dropdown */}
                                {showSuggestions && (
                                    <div
                                        ref={dropdownRef}
                                        className="absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto"
                                    >
                                        {isLoadingSuggestions ? (
                                            <div className="p-3 text-sm text-slate-500 flex items-center">
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Loading suggestions...
                                            </div>
                                        ) : (
                                            addressSuggestions.map((suggestion) => (
                                                <div
                                                    key={suggestion.place_id}
                                                    className="p-3 hover:bg-slate-50 cursor-pointer border-b last:border-b-0 text-sm"
                                                    onMouseDown={() => handleAddressSelect(suggestion)}
                                                >
                                                    {suggestion.description}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="city">City</Label>
                                <Input
                                    id="city"
                                    value={formData.city}
                                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                                    placeholder="Your city"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="postal">Postal Code</Label>
                                <Input
                                    id="postal"
                                    value={formData.postalCode}
                                    onChange={(e) => setFormData(prev => ({ ...prev, postalCode: e.target.value }))}
                                    placeholder="12345"
                                />
                            </div>

                            <Separator />

                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={autofillWithCurrentLocation}
                                    disabled={isFetchingLocation}
                                >
                                    {isFetchingLocation ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Getting Location...
                                        </>
                                    ) : (
                                        <>
                                            <LocateFixed className="w-4 h-4 mr-2" />
                                            Use My Current Location
                                        </>
                                    )}
                                </Button>

                                <Button
                                    type="submit"
                                    className="bg-red-600 text-white hover:bg-red-700"
                                    disabled={
                                        isSubmitting ||
                                        !formData.address || !formData.city || !formData.postalCode ||
                                        !Number.isFinite(Number(formData.latitude)) ||
                                        !Number.isFinite(Number(formData.longitude))
                                    }
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Save Location
                                        </>
                                    )}
                                </Button>
                            </div>

                            {error && (
                                <div className="text-sm text-red-600 mt-2 flex items-center">
                                    <AlertCircle className="w-4 h-4 mr-2" />
                                    {error}
                                </div>
                            )}
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default SetupLocationPage;