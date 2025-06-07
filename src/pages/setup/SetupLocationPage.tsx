// SetupLocationPage.tsx (updated to use Google Maps Autocomplete widget)

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, LocateFixed, Save, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { getCurrentLocation } from '@/services/getCurrentLocation';
import { fetchUserAttributes } from 'aws-amplify/auth';
import { client } from '@/lib/amplifyClient';
import {reverseGeocode, loadGoogleMapsScript, fetchGoogleMapsKey} from '@/services/googleMapsApi';


const SetupLocationPage = () => {
    const navigate = useNavigate();
    const addressInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        address: '',
        city: '',
        postalCode: '',
        latitude: '',
        longitude: ''
    });

    const [isFetchingLocation, setIsFetchingLocation] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Cache api key
    const googleMapsKeyRef = useRef<string | null>(null);



    const initAutocomplete = () => {
        if (!window.google || !addressInputRef.current) return;

        const autocomplete = new window.google.maps.places.Autocomplete(addressInputRef.current, {
            types: ['address'],
            componentRestrictions: { country: 'no' } // Restricts to Norway
        });

        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (!place.geometry || !place.address_components) return;

            const getComponent = (type: string) => {
                return place.address_components?.find(c => c.types.includes(type))?.long_name || '';
            };

            if (!place.geometry || !place.geometry.location) {
                console.error("No geometry/location returned for place:", place);
                return;
            }

            const location = place.geometry.location;
            const lat = location.lat();
            const lng = location.lng();

            setFormData({
                address: addressInputRef.current?.value || '',
                city: getComponent('locality') || getComponent('administrative_area_level_2'),
                postalCode: getComponent('postal_code'),
                latitude: lat.toString(),
                longitude: lng.toString()
            });
        });
    };

    useEffect(() => {
        const setupGoogleMaps = async () => {
            if (!googleMapsKeyRef.current) {
                googleMapsKeyRef.current = await fetchGoogleMapsKey();
            }

            const key = googleMapsKeyRef.current;

            if (key) {
                loadGoogleMapsScript(key);
            } else {
                console.error('❌ Could not load Google Maps script - missing API key');
                setError('Could not load Google Maps');
            }
        };

        setupGoogleMaps();

        const waitForGoogle = setInterval(() => {
            if (window.google && window.google.maps && window.google.maps.places) {
                clearInterval(waitForGoogle);
                initAutocomplete();
            }
        }, 300);

        return () => clearInterval(waitForGoogle);
    }, []);


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
                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Input
                                    id="address"
                                    ref={addressInputRef}
                                    value={formData.address}
                                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                                    placeholder="123 Main St"
                                />
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
                                    disabled={isSubmitting}
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
