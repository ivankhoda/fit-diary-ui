/* eslint-disable func-style */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-eq-null */
/* eslint-disable eqeqeq */
// Service Worker Registration Utility

export function register(config?: {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
}) {
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            const swUrl = `${process.env.PUBLIC_URL || ''}/service-worker.js`;

            navigator.serviceWorker
                .register(swUrl)
                .then(registration => {
                    registration.onupdatefound = () => {
                        const installingWorker = registration.installing;

                        if (installingWorker == null) {
                            return;
                        }
                        installingWorker.onstatechange = () => {
                            if (installingWorker.state === 'installed') {
                                if (navigator.serviceWorker.controller) {
                                    // New content is available; please refresh.
                                    console.log('New content is available; please refresh.');
                                    if (config && config.onUpdate) {
                                        config.onUpdate(registration);
                                    }
                                } else {
                                    // Content is cached for offline use.
                                    console.log('Content is cached for offline use.');
                                    if (config && config.onSuccess) {
                                        config.onSuccess(registration);
                                    }
                                }
                            }
                        };
                    };
                })
                .catch(error => {
                    console.error('Error during service worker registration:', error);
                });

            // Listen for messages from service worker
            navigator.serviceWorker.addEventListener('message', event => {
                if (event.data && event.data.type === 'SYNC_QUEUE') {
                    // Trigger offline queue sync
                    const syncEvent = new CustomEvent('sw-sync-queue');
                    window.dispatchEvent(syncEvent);
                }
            });
        });
    }
}

export function unregister() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready
            .then(registration => {
                registration.unregister();
            })
            .catch(error => {
                console.error(error.message);
            });
    }
}
