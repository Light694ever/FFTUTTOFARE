// Gestione dei cookie
document.addEventListener('DOMContentLoaded', function() {
    // Funzione per impostare un cookie
    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    // Funzione per ottenere un cookie
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

    // Funzione per controllare se i cookie sono stati accettati
    function checkCookieConsent() {
        if (getCookie('cookie_consent') !== 'accepted') {
            // Se i cookie non sono stati accettati, mostro il banner
            showCookieBanner();
        }
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
                setCookie('cookie_consent', 'accepted', 365); // Cookie valido per un anno
                banner.remove();
                
                // Qui attiverei eventuali script che richiedono consenso (Google Analytics, ecc.)
                activateAnalytics();
            });
            
            // Event listener per il pulsante "Rifiuta"
            document.getElementById('cookie-reject').addEventListener('click', function() {
                setCookie('cookie_consent', 'rejected', 365); // Cookie valido per un anno
                banner.remove();
                
                // Non attivo script che richiedono consenso
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
});