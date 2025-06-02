// Optional: Function to get user's current location
import {Coordinates} from "@/services/addBookToIndex.ts";

export const getCurrentLocation = (): Promise<Coordinates | null> => {
    return new Promise<Coordinates | null>((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by this browser'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            },
            (error) => {
                console.warn('Location access denied or failed:', error);
                resolve(null); // Return null instead of rejecting to make location optional
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000 // 5 minutes
            }
        );
    });
};