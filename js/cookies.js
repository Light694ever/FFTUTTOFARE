// Gestione dei cookie con localStorage per tracciamento GDPR-compliant
// Versione Policy: 1.0 (aggiorna quando cambi la policy)
const POLICY_VERSION = '1.0';
const POLICY_DATE = '2026-02-02';

document.addEventListener('DOMContentLoaded', function() {
    // Funzione per impostare un cookie HTTP
    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    // Funzione per ottenere un cookie HTTP
    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    // Funzione per cancellare un cookie
    function eraseCookie(name) {
        document.cookie = name + '=; Max-Age=-99999999;';
    }

    // ===== NUOVO: Funzioni localStorage per tracciamento GDPR =====
    // Funzione per salvare il consenso in localStorage (traccia audit GDPR)
    function saveConsentToLocalStorage(consentData) {
        const consentRecord = {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            policy_version: POLICY_VERSION,
            policy_date: POLICY_DATE,
            ...consentData
        };
        localStorage.setItem('cookie_consent_data', JSON.stringify(consentRecord));
        console.log('Consenso ai cookie salvato:', consentRecord);
    }

    // Funzione per recuperare il consenso da localStorage
    function getConsentFromLocalStorage() {
        const data = localStorage.getItem('cookie_consent_data');
        return data ? JSON.parse(data) : null;
    }

    // Funzione per cancellare il consenso da localStorage
    function clearConsentFromLocalStorage() {
        localStorage.removeItem('cookie_consent_data');
        console.log('Consenso ai cookie cancellato da localStorage');
    }

    // ===== FINE NUOVO =====

    // Funzione per controllare se i cookie sono stati accettati
    function checkCookieConsent() {
        // Controlla sia cookie HTTP che localStorage
        const hasHTTPConsent = getCookie('cookie_consent') === 'accepted';
        const hasLocalStorageConsent = getConsentFromLocalStorage();
        
        if (!hasHTTPConsent && !hasLocalStorageConsent) {
            // Se i cookie non sono stati accettati, mostro il banner
            showCookieBanner();
        }
    }

    // ===== NUOVO: Funzione per revocare il consenso =====
    function revokeConsent() {
        const consentData = getConsentFromLocalStorage();
        
        if (consentData) {
            // Salvo la revoca nel localStorage con timestamp
            const revokeRecord = {
                ...consentData,
                revoked_at: new Date().toISOString(),
                revoke_reason: 'user_request'
            };
            
            localStorage.setItem('cookie_consent_data', JSON.stringify(revokeRecord));
            
            // Cancello il cookie HTTP
            eraseCookie('cookie_consent');
            
            console.log('Consenso revocato:', revokeRecord);
            alert('Il tuo consenso ai cookie è stato revocato. Il banner verrà visualizzato al prossimo caricamento della pagina.');
            
            // Ricarico la pagina per mostrare di nuovo il banner
            setTimeout(() => {
                location.reload();
            }, 1500);
        } else {
            alert('Nessun consenso trovato da revocare.');
        }
    }

    // ===== NUOVO: Gestire il click sul link "Revoca Consenso" =====
    const revokeLink = document.getElementById('revoke-consent-link');
    if (revokeLink) {
        revokeLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Mostra un modal di conferma
            const confirmed = confirm(
                'Sei sicuro di voler revocare il tuo consenso ai cookie?\n\n' +
                'Potrai comunque continuare a utilizzare il sito normalmente.'
            );
            
            if (confirmed) {
                revokeConsent();
            }
        });
    }

    // Funzione per mostrare il banner dei cookie
    function showCookieBanner() {
        // Creo il banner dei cookie se non esiste già
        if (!document.getElementById('cookie-banner')) {
            const banner = document.createElement('div');
            banner.id = 'cookie-banner';
            banner.innerHTML = `
                <div class="cookie-content">
                    <p>Questo sito utilizza i cookie per migliorare la tua esperienza. Continuando a utilizzare il sito, accetti la nostra <a href="cookies.html">Cookie Policy</a>.</p>
                    <div class="cookie-buttons">
                        <button id="cookie-accept" class="btn">Accetta</button>
                        <button id="cookie-reject" class="btn btn-secondary">Rifiuta</button>
                        <button id="cookie-settings" class="btn btn-tertiary">Impostazioni</button>
                    </div>
                </div>
            `;
            
            // Applico stili al banner
            banner.style.position = 'fixed';
            banner.style.bottom = '0';
            banner.style.left = '0';
            banner.style.width = '100%';
            banner.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            banner.style.boxShadow = '0 -2px 10px rgba(0, 0, 0, 0.1)';
            banner.style.zIndex = '1000';
            banner.style.padding = '15px';
            
            // Aggiungo il banner al body
            document.body.appendChild(banner);
            
            // Event listener per il pulsante "Accetta"
            document.getElementById('cookie-accept').addEventListener('click', function() {
                const consentData = {
                    consent_type: 'all_accepted',
                    necessary: true,
                    analytics: true,
                    marketing: true,
                    preferences: true
                };
                
                // Salvo in localStorage (GDPR audit trail)
                saveConsentToLocalStorage(consentData);
                
                // Imposto il cookie HTTP
                setCookie('cookie_consent', 'accepted', 365);
                banner.remove();
                
                // Attivo script di tracking
                activateAnalytics();
            });
            
            // Event listener per il pulsante "Rifiuta"
            document.getElementById('cookie-reject').addEventListener('click', function() {
                const consentData = {
                    consent_type: 'all_rejected',
                    necessary: true, // I cookie necessari sono sempre abilitati
                    analytics: false,
                    marketing: false,
                    preferences: false
                };
                
                // Salvo in localStorage (GDPR audit trail)
                saveConsentToLocalStorage(consentData);
                
                // Imposto il cookie HTTP
                setCookie('cookie_consent', 'rejected', 365);
                banner.remove();
            });
            
            // Event listener per il pulsante "Impostazioni" (facoltativo)
            document.getElementById('cookie-settings').addEventListener('click', function() {
                showCookieSettings();
            });
        }
    }
    
    // Funzione per mostrare le impostazioni avanzate dei cookie
    function showCookieSettings() {
        // Creo un modal per le impostazioni avanzate
        if (!document.getElementById('cookie-settings-modal')) {
            const modal = document.createElement('div');
            modal.id = 'cookie-settings-modal';
            modal.innerHTML = `
                <div class="cookie-modal-overlay">
                    <div class="cookie-modal">
                        <h3>Preferenze Cookie</h3>
                        <div class="cookie-setting">
                            <label>
                                <input type="checkbox" id="cookie-necessary" checked disabled>
                                <strong>Cookie Necessari</strong>
                                <p>Obbligatori per il funzionamento del sito</p>
                            </label>
                        </div>
                        <div class="cookie-setting">
                            <label>
                                <input type="checkbox" id="cookie-analytics">
                                <strong>Cookie Analitici</strong>
                                <p>Per analizzare l'uso del sito e migliorare l'esperienza</p>
                            </label>
                        </div>
                        <div class="cookie-setting">
                            <label>
                                <input type="checkbox" id="cookie-marketing">
                                <strong>Cookie di Marketing</strong>
                                <p>Per personalizzare annunci e contenuti</p>
                            </label>
                        </div>
                        <div class="cookie-setting">
                            <label>
                                <input type="checkbox" id="cookie-preferences">
                                <strong>Cookie di Preferenze</strong>
                                <p>Per ricordare le tue preferenze</p>
                            </label>
                        </div>
                        <div class="cookie-modal-buttons">
                            <button id="cookie-save-settings" class="btn">Salva Preferenze</button>
                            <button id="cookie-close-settings" class="btn btn-secondary">Annulla</button>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Stili per il modal
            modal.style.position = 'fixed';
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.width = '100%';
            modal.style.height = '100%';
            modal.style.display = 'flex';
            modal.style.alignItems = 'center';
            modal.style.justifyContent = 'center';
            modal.style.zIndex = '2000';
            
            const overlay = modal.querySelector('.cookie-modal-overlay');
            overlay.style.position = 'absolute';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            
            const modalContent = modal.querySelector('.cookie-modal');
            modalContent.style.position = 'relative';
            modalContent.style.backgroundColor = 'white';
            modalContent.style.padding = '30px';
            modalContent.style.borderRadius = '8px';
            modalContent.style.maxWidth = '500px';
            modalContent.style.zIndex = '2001';
            
            // Event listener per salvare le impostazioni
            document.getElementById('cookie-save-settings').addEventListener('click', function() {
                const consentData = {
                    consent_type: 'custom',
                    necessary: true,
                    analytics: document.getElementById('cookie-analytics').checked,
                    marketing: document.getElementById('cookie-marketing').checked,
                    preferences: document.getElementById('cookie-preferences').checked
                };
                
                // Salvo in localStorage
                saveConsentToLocalStorage(consentData);
                
                // Imposto il cookie HTTP
                setCookie('cookie_consent', 'custom', 365);
                
                modal.remove();
                document.getElementById('cookie-banner').remove();
            });
            
            // Event listener per chiudere il modal
            document.getElementById('cookie-close-settings').addEventListener('click', function() {
                modal.remove();
            });
        }
    }
    
    // Funzione per attivare Google Analytics o altri script di tracking
    function activateAnalytics() {
        // Qui inseriresti il codice per caricare Google Analytics o altri script
        // Ad esempio:
        /*
        const analyticsScript = document.createElement('script');
        analyticsScript.async = true;
        analyticsScript.src = 'https://www.googletagmanager.com/gtag/js?id=UA-XXXXXXXX-X';
        document.head.appendChild(analyticsScript);
        
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'UA-XXXXXXXX-X');
        */
    }
    
    // Verifico lo stato del consenso ai cookie al caricamento della pagina
    checkCookieConsent();
    
    // BONUS: Funzione per esportare i dati di consenso (utile per audit GDPR)
    window.exportCookieConsentData = function() {
        const consentData = getConsentFromLocalStorage();
        if (consentData) {
            console.log('Dati di consenso ai cookie:', consentData);
            console.log('JSON:', JSON.stringify(consentData, null, 2));
            return consentData;
        } else {
            console.log('Nessun consenso ai cookie trovato');
            return null;
        }
    }
});