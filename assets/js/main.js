/**
 * Amelia Dwi Oktaviani - Graduation Celebration Web Application
 * Unified Script Engine: WebGL Shader, Countdown, Floating Audio Player, Map, Lightbox, Mobile Nav, Guestbook, Effects.
 * Created by Ricki (2026)
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. PRELOADER & INITIALIZATION
    // ==========================================
    const preloader = document.getElementById('preloader');
    const preloaderBar = document.getElementById('preloader-bar');

    if (preloader && preloaderBar) {
        document.body.style.overflow = 'hidden';
        let progress = 0;
        const progressTimer = setInterval(() => {
            progress += Math.random() * 20;
            if (progress > 100) progress = 100;
            preloaderBar.style.width = progress + '%';
            if (progress >= 100) clearInterval(progressTimer);
        }, 120);

        const hidePreloader = () => {
            preloaderBar.style.width = '100%';
            setTimeout(() => {
                preloader.classList.add('loaded');
                document.body.style.overflow = '';
                initHeadlineReveal();
            }, 300);
        };

        window.addEventListener('load', () => setTimeout(hidePreloader, 400));
        setTimeout(() => {
            if (!preloader.classList.contains('loaded')) hidePreloader();
        }, 3000);
    } else {
        initHeadlineReveal();
    }

    // ==========================================
    // 2. HERO HEADLINE WORD REVEAL
    // ==========================================
    const heroHeading = document.getElementById('hero-heading');
    function initHeadlineReveal() {
        if (!heroHeading) return;
        const words = heroHeading.innerText.trim().split(/\s+/);
        heroHeading.innerHTML = words.map((w, i) =>
            `<span style="transition-delay:${0.06 * i}s">${w}&nbsp;</span>`
        ).join('');
        requestAnimationFrame(() => {
            heroHeading.classList.add('active');
        });
    }

    // ==========================================
    // 3. GRADUATION COUNTDOWN TIMER (6 OCTOBER 2026)
    // ==========================================
    // Target: October 6, 2026 09:00:00 WIB (Grand Ballroom Hotel PULLMAN Podomoro City, Jl. Letjen S. Parman Kav. 28, Jakarta Barat)
    const graduationTargetDate = new Date('2026-10-06T09:00:00+07:00').getTime();

    const daysEl = document.getElementById('cd-days');
    const hoursEl = document.getElementById('cd-hours');
    const minutesEl = document.getElementById('cd-minutes');
    const secondsEl = document.getElementById('cd-seconds');

    function updateCountdown() {
        if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;
        const now = new Date().getTime();
        const diff = graduationTargetDate - now;

        if (diff <= 0) {
            daysEl.textContent = '00';
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';
            return;
        }

        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        daysEl.textContent = String(d).padStart(2, '0');
        hoursEl.textContent = String(h).padStart(2, '0');
        minutesEl.textContent = String(m).padStart(2, '0');
        secondsEl.textContent = String(s).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // ==========================================
    // 4. FLOATING MINI AUDIO PLAYER & PLAYLIST SYNC
    // ==========================================
    const playlistItems = Array.from(document.querySelectorAll('#playlist-list .playlist-item'));
    const floatingPlayer = document.getElementById('floating-player');
    const floatingTitle = document.getElementById('floating-title');
    const floatingArtist = document.getElementById('floating-artist');
    const floatingPlayBtn = document.getElementById('floating-play-btn');
    const floatingPlayIcon = document.getElementById('floating-play-icon');
    const floatingPrevBtn = document.getElementById('floating-prev-btn');
    const floatingNextBtn = document.getElementById('floating-next-btn');

    let currentTrackIndex = -1;
    let globalAudio = new Audio();
    globalAudio.preload = 'metadata';

    const tracksData = playlistItems.map((item, idx) => {
        const btn = item.querySelector('.playlist-row');
        const title = item.querySelector('.playlist-title')?.textContent || `Track ${idx + 1}`;
        const artist = item.querySelector('.playlist-artist')?.textContent || 'Amelia\'s Playlist';
        const src = btn?.getAttribute('data-src') || '';
        return { index: idx, title, artist, src, element: item, button: btn };
    });

    function playTrack(index) {
        if (index < 0 || index >= tracksData.length) return;
        const track = tracksData[index];
        if (!track.src) return;

        currentTrackIndex = index;
        globalAudio.src = track.src;
        globalAudio.play().then(() => {
            updatePlayerUI(true);
        }).catch(err => {
            console.warn('Audio play auto-block:', err);
            updatePlayerUI(false);
        });
    }

    function togglePlayPause() {
        if (currentTrackIndex === -1 && tracksData.length > 0) {
            playTrack(0);
            return;
        }
        if (globalAudio.paused) {
            globalAudio.play();
            updatePlayerUI(true);
        } else {
            globalAudio.pause();
            updatePlayerUI(false);
        }
    }

    function updatePlayerUI(isPlaying) {
        if (floatingPlayer) floatingPlayer.classList.remove('hidden');
        if (currentTrackIndex >= 0 && currentTrackIndex < tracksData.length) {
            const track = tracksData[currentTrackIndex];
            if (floatingTitle) floatingTitle.textContent = track.title;
            if (floatingArtist) floatingArtist.textContent = track.artist;
        }

        if (floatingPlayIcon) {
            floatingPlayIcon.textContent = isPlaying ? 'pause' : 'play_arrow';
        }

        const audioEq = document.getElementById('audio-visualizer');
        if (audioEq) {
            if (isPlaying) {
                audioEq.classList.add('playing');
            } else {
                audioEq.classList.remove('playing');
            }
        }

        tracksData.forEach((t, idx) => {
            const wrap = t.element.querySelector('.playlist-embed-wrap');
            const inner = t.element.querySelector('.playlist-embed-inner');

            if (idx === currentTrackIndex) {
                t.button.setAttribute('aria-expanded', 'true');
                if (wrap) wrap.classList.add('open');
                if (inner && !inner.querySelector('.now-playing-indicator')) {
                    inner.innerHTML = `
                        <div class="now-playing-indicator pt-2 pb-3 px-3 flex items-center justify-between text-xs text-primary font-bold bg-primary-container/20 rounded-b-xl border-t border-primary/20">
                            <span class="flex items-center gap-2">
                                <span class="material-symbols-outlined text-base animate-spin">music_note</span>
                                ${isPlaying ? 'Memutar Lagu Ini...' : 'Dijeda'}
                            </span>
                            <button type="button" class="px-3 py-1 bg-primary text-on-primary rounded-full text-xs hover:scale-105 transition-transform" onclick="window.toggleGlobalAudio()">
                                ${isPlaying ? 'Jeda' : 'Putar'}
                            </button>
                        </div>
                    `;
                }
            } else {
                t.button.setAttribute('aria-expanded', 'false');
                if (wrap) wrap.classList.remove('open');
                if (inner) inner.innerHTML = '';
            }
        });
    }

    window.toggleGlobalAudio = togglePlayPause;

    tracksData.forEach((t, idx) => {
        t.button.addEventListener('click', () => {
            if (currentTrackIndex === idx) {
                togglePlayPause();
            } else {
                playTrack(idx);
            }
        });
    });

    if (floatingPlayBtn) floatingPlayBtn.addEventListener('click', togglePlayPause);
    if (floatingNextBtn) {
        floatingNextBtn.addEventListener('click', () => {
            const nextIdx = (currentTrackIndex + 1) % tracksData.length;
            playTrack(nextIdx);
        });
    }
    if (floatingPrevBtn) {
        floatingPrevBtn.addEventListener('click', () => {
            const prevIdx = (currentTrackIndex - 1 + tracksData.length) % tracksData.length;
            playTrack(prevIdx);
        });
    }

    globalAudio.addEventListener('ended', () => {
        const nextIdx = (currentTrackIndex + 1) % tracksData.length;
        playTrack(nextIdx);
    });

    // ==========================================
    // 5. MOBILE NAVIGATION DRAWER
    // ==========================================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const mobileDrawerClose = document.getElementById('mobile-drawer-close');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    function openMobileDrawer() {
        if (mobileDrawer) {
            mobileDrawer.classList.remove('translate-x-full');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeMobileDrawer() {
        if (mobileDrawer) {
            mobileDrawer.classList.add('translate-x-full');
            document.body.style.overflow = '';
        }
    }

    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMobileDrawer);
    if (mobileDrawerClose) mobileDrawerClose.addEventListener('click', closeMobileDrawer);
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileDrawer();
        });
    });

    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a:not(.mobile-nav-link)');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 160) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                link.classList.remove('text-primary', 'border-b-2', 'border-primary', 'font-bold', 'pb-1');
                link.classList.add('text-on-surface-variant');
                if (href.includes(current) && current !== '') {
                    link.classList.add('text-primary', 'border-b-2', 'border-primary', 'font-bold', 'pb-1');
                    link.classList.remove('text-on-surface-variant');
                }
            }
        });
    }, { passive: true });

    // ==========================================
    // 6. PHOTO LIGHTBOX MODAL
    // ==========================================
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');

    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const caption = item.querySelector('.gallery-caption')?.textContent || '';
            if (img && lightboxModal && lightboxImg) {
                lightboxImg.src = img.src;
                if (lightboxCaption) lightboxCaption.textContent = caption;
                lightboxModal.classList.remove('hidden');
                lightboxModal.classList.add('flex');
            }
        });
    });

    if (lightboxClose) {
        lightboxClose.addEventListener('click', () => {
            if (lightboxModal) {
                lightboxModal.classList.add('hidden');
                lightboxModal.classList.remove('flex');
            }
        });
    }
    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                lightboxModal.classList.add('hidden');
                lightboxModal.classList.remove('flex');
            }
        });
    }

    // ==========================================
    // 7. DYNAMIC GUESTBOOK (LOCALSTORAGE + WHATSAPP)
    // ==========================================
    const guestbookForm = document.getElementById('guestbook-form');
    const guestbookEntries = document.getElementById('guestbook-entries');

    const defaultWishes = [
        {
            name: "Ricki",
            rel: "For My Love, Amelia",
            message: "To the love of my life, Amelia Dwi Oktaviani, S.Ak. ✨ From endless quiet study sessions to late nights mastering every accounting ledger, I've watched you pour your whole heart into this journey. Seeing you earn your degree fills me with overwhelming joy. I am endlessly proud of the brilliant, strong, and incredible woman you are! ❤️"
        },
        {
            name: "Ricki",
            rel: "Your Soulmate & Partner for Life",
            message: "Happy Graduation, my sweet Amelia! 🎓 You turned every revision and late-night challenge into a beautiful victory. Becoming a Sarjana Akuntansi is just the first of so many milestones we will celebrate together. I promise to always be your biggest supporter and walk beside you in everything you do! ✨"
        }
    ];

    function loadWishes() {
        if (!guestbookEntries) return;
        const stored = JSON.parse(localStorage.getItem('amelia_guestbook_wishes') || '[]');
        const allWishes = stored.length > 0 ? stored : defaultWishes;

        guestbookEntries.innerHTML = allWishes.map((w, i) => `
            <div class="p-6 rounded-xl bg-white/70 backdrop-blur-sm border border-outline-variant/30 romantic-shadow hover-glow transition-all italic reveal reveal-${i % 2 === 0 ? 'left' : 'right'} active">
                <p class="text-on-surface mb-4 leading-relaxed font-body-md">"${w.message}"</p>
                <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center text-primary font-bold text-sm shadow-sm">
                        ${(w.name || 'G').charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <span class="text-label-sm font-bold text-on-surface block leading-none">${w.name}</span>
                        ${w.rel ? `<span class="text-xs text-on-surface-variant/70 not-italic">${w.rel}</span>` : ''}
                    </div>
                </div>
            </div>
        `).join('');
    }

    loadWishes();

    if (guestbookForm) {
        guestbookForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const phoneNumber = '6281388796229';
            const nameInput = document.getElementById('guest-name');
            const relInput = document.getElementById('guest-relation');
            const msgInput = document.getElementById('guest-message');

            const name = nameInput ? nameInput.value.trim() : 'Teman';
            const rel = relInput ? relInput.value.trim() : '';
            const message = msgInput ? msgInput.value.trim() : '';

            if (!name || !message) return;

            const stored = JSON.parse(localStorage.getItem('amelia_guestbook_wishes') || '[]');
            stored.unshift({ name, rel, message });
            localStorage.setItem('amelia_guestbook_wishes', JSON.stringify(stored));

            loadWishes();
            fireConfetti();
            guestbookForm.reset();

            const fullMessage = `Hi, ini ucapan spesial dari *${name}* (${rel || 'Sahabat'}) untuk Amelia:\n\n"${message}"`;
            const encodedMessage = encodeURIComponent(fullMessage);
            const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
            window.open(whatsappURL, '_blank');
        });
    }

    // ==========================================
    // 8. CAMPUS ROUTE MAP (LEAFLET + CARTO + OSRM)
    // ==========================================
    (function initRouteMap() {
        const mapEl = document.getElementById('route-map');
        if (!mapEl || typeof L === 'undefined') return;

        const ORIGIN_LATLNG = [-6.2148, 106.9957];
        const DEST_LATLNG = [-6.1589, 106.9724];

        function pinIcon(bg, glyph) {
            return L.divIcon({
                html: `<div style="background:${bg};width:34px;height:34px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.28);">
                         <span class="material-symbols-outlined" style="color:#fff;font-size:18px;transform:rotate(45deg);">${glyph}</span>
                       </div>`,
                className: '',
                iconSize: [34, 34],
                iconAnchor: [17, 34],
                popupAnchor: [0, -32]
            });
        }
        const homeIcon = pinIcon('#7b5455', 'home');
        const campusIcon = pinIcon('#8c4b55', 'school');

        const map = L.map('route-map', { scrollWheelZoom: false, zoomControl: true, attributionControl: true });
        L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
            attribution: 'Map data &copy; Google Maps'
        }).addTo(map);
        map.setView(ORIGIN_LATLNG, 12);

        async function fetchRoad(originLatLng, destLatLng) {
            try {
                const url = `https://router.project-osrm.org/route/v1/driving/${originLatLng[1]},${originLatLng[0]};${destLatLng[1]},${destLatLng[0]}?overview=full&geometries=geojson`;
                const res = await fetch(url);
                const data = await res.json();
                if (data && data.routes && data.routes[0]) {
                    const route = data.routes[0];
                    return {
                        coords: route.geometry.coordinates.map(c => [c[1], c[0]]),
                        distanceKm: route.distance / 1000,
                        durationMin: route.duration / 60
                    };
                }
            } catch (e) {
                console.warn('OSRM routing fallback:', e);
            }
            return { coords: [originLatLng, destLatLng], distanceKm: 9.2, durationMin: 25, estimated: true };
        }

        (async function run() {
            L.marker(ORIGIN_LATLNG, { icon: homeIcon }).addTo(map).bindPopup('🏠 Rumah (Harapan Jaya)');
            L.marker(DEST_LATLNG, { icon: campusIcon }).addTo(map).bindPopup('🎓 Universitas Esa Unggul Kampus Bekasi');

            const road = await fetchRoad(ORIGIN_LATLNG, DEST_LATLNG);
            const routeLine = L.polyline(road.coords, { color: '#7b5455', weight: 5, opacity: 0.85, lineJoin: 'round' }).addTo(map);
            map.fitBounds(routeLine.getBounds(), { padding: [30, 30] });

            const distEl = document.getElementById('route-distance');
            const durEl = document.getElementById('route-duration');
            if (distEl) distEl.textContent = '~' + road.distanceKm.toFixed(1) + ' km';
            if (durEl) durEl.textContent = '25-30 min';

            const loadingEl = document.getElementById('route-map-loading');
            if (loadingEl) loadingEl.remove();

            setTimeout(() => map.invalidateSize(), 200);
        })();

        const section = document.getElementById('campus-map');
        if (section) {
            const mapObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => map.invalidateSize(), 200);
                        mapObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });
        }
    })();

    // ==========================================
    // 8.5 HOTEL PULLMAN PODOMORO CITY MAP (HOME TO WISUDA ROUTE)
    // ==========================================
    (function initPullmanMap() {
        if (typeof L === 'undefined') return;
        const container = document.getElementById('pullman-map');
        if (!container) return;

        const homeLat = -6.2085;
        const homeLng = 106.9930;
        const pullmanLat = -6.1772;
        const pullmanLng = 106.7909;

        const map = L.map('pullman-map', {
            center: [-6.1928, 106.8920],
            zoom: 12,
            scrollWheelZoom: false,
            zoomControl: true
        });

        L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
            attribution: 'Map data &copy; Google Maps'
        }).addTo(map);

        // Home Marker Icon
        const homeIcon = L.divIcon({
            className: 'home-pin',
            html: `<div style="width:34px;height:34px;border-radius:50%;background:#8c4b55;color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(140,75,85,0.4);border:2px solid #fff;">
                    <span class="material-symbols-outlined" style="font-size:18px;">home</span>
                   </div>`,
            iconSize: [34, 34],
            iconAnchor: [17, 17]
        });

        // Pullman Marker Icon
        const pullmanIcon = L.divIcon({
            className: 'pullman-pin',
            html: `<div style="width:38px;height:38px;border-radius:50%;background:#7b5455;color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(123,84,85,0.6);border:2px solid #fef08a;">
                    <span class="material-symbols-outlined" style="font-size:22px;">workspace_premium</span>
                   </div>`,
            iconSize: [38, 38],
            iconAnchor: [19, 19]
        });

        L.marker([homeLat, homeLng], { icon: homeIcon })
            .addTo(map)
            .bindTooltip("🏡 Titik A: Rumah Amelia", { permanent: true, direction: "top", offset: [0, -18] })
            .bindPopup(`<b>Rumah Amelia 🏡</b><br/>Jl. Segara Wana No. 44, RT 09/RW 25,<br/>Harapan Jaya, Bekasi Utara`);

        L.marker([pullmanLat, pullmanLng], { icon: pullmanIcon })
            .addTo(map)
            .bindTooltip("🎓 Titik B: Hotel PULLMAN Wisuda", { permanent: true, direction: "top", offset: [0, -20] })
            .bindPopup(`<b>Hotel PULLMAN Podomoro City 🎓</b><br/>Jl. Letjen S. Parman Kav. 28, Jakarta Barat<br/><b>Wisuda S.Ak. • 6 Oktober 2026</b>`)
            .openPopup();

        // Fetch OSRM route or fallback polyline
        const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${homeLng},${homeLat};${pullmanLng},${pullmanLat}?overview=full&geometries=geojson`;

        fetch(osrmUrl)
            .then(res => res.json())
            .then(data => {
                if (data.routes && data.routes.length > 0) {
                    const route = data.routes[0];
                    const coords = route.geometry.coordinates.map(c => [c[1], c[0]]);

                    // Outer Glowing Accent Line
                    L.polyline(coords, {
                        color: '#f4c2c2',
                        weight: 10,
                        opacity: 0.75,
                        lineCap: 'round'
                    }).addTo(map);

                    // Inner Bold Driving Line
                    const routeLine = L.polyline(coords, {
                        color: '#881337',
                        weight: 5,
                        opacity: 0.95,
                        dashArray: '10, 8',
                        lineCap: 'round'
                    }).addTo(map);

                    map.fitBounds(routeLine.getBounds(), { padding: [40, 40] });

                    const distEl = document.getElementById('pullman-distance');
                    const durEl = document.getElementById('pullman-duration');
                    if (distEl) distEl.textContent = '~' + (route.distance / 1000).toFixed(1) + ' km';
                    if (durEl) durEl.textContent = '~1.5 - 2 Jam 🚗';
                }
            })
            .catch(err => {
                console.warn('OSRM Pullman route fallback:', err);
                const fallbackCoords = [[homeLat, homeLng], [pullmanLat, pullmanLng]];

                L.polyline(fallbackCoords, {
                    color: '#f4c2c2',
                    weight: 8,
                    opacity: 0.7
                }).addTo(map);

                const routeLine = L.polyline(fallbackCoords, {
                    color: '#881337',
                    weight: 5,
                    opacity: 0.9,
                    dashArray: '8, 8'
                }).addTo(map);

                map.fitBounds(routeLine.getBounds(), { padding: [40, 40] });
            });

        const section = document.getElementById('venue-guide');
        if (section) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => map.invalidateSize(), 250);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });
            observer.observe(section);
        }
    })();

    // ==========================================
    // 9. SECRET LETTER ENVELOPE INTERACTION (3D WAX SEAL)
    // ==========================================
    (function initEnvelope() {
        const envelope = document.getElementById('envelope');
        const waxSeal = document.getElementById('wax-seal-stamp');
        const letterContent = document.getElementById('secret-letter-content');
        if (!envelope || !letterContent) return;

        const handleOpen = () => {
            if (waxSeal) {
                waxSeal.classList.add('break-seal');
            }
            const isOpened = envelope.classList.toggle('opened');
            if (isOpened) {
                setTimeout(() => {
                    letterContent.classList.remove('hidden');
                    requestAnimationFrame(() => {
                        letterContent.style.opacity = '0';
                        letterContent.style.transform = 'translateY(20px)';
                        letterContent.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                        requestAnimationFrame(() => {
                            letterContent.style.opacity = '1';
                            letterContent.style.transform = 'translateY(0)';
                        });
                    });
                }, 400);
                fireConfetti();
            } else {
                letterContent.classList.add('hidden');
                if (waxSeal) waxSeal.classList.remove('break-seal');
            }
        };

        envelope.addEventListener('click', handleOpen);
        if (waxSeal) waxSeal.addEventListener('click', (e) => {
            e.stopPropagation();
            handleOpen();
        });
    })();

    // ==========================================
    // 9.5 GALLERY FILTERS & PERSISTENT PHOTO REACTION ENGINE
    // ==========================================
    (function initGalleryFeatures() {
        const filterBtns = document.querySelectorAll('.gallery-filter-btn');
        const galleryItems = document.querySelectorAll('#gallery-grid .gallery-item');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => {
                    b.classList.remove('bg-primary', 'text-on-primary', 'shadow-md', 'active');
                    b.classList.add('bg-surface-container-high', 'text-on-surface-variant');
                });
                btn.classList.add('bg-primary', 'text-on-primary', 'shadow-md', 'active');
                btn.classList.remove('bg-surface-container-high', 'text-on-surface-variant');

                const cat = btn.getAttribute('data-category');
                galleryItems.forEach(item => {
                    const itemCat = item.getAttribute('data-category');
                    if (cat === 'all' || itemCat === cat) {
                        item.style.display = '';
                        item.classList.add('reveal', 'active');
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });

        // Photo Like Reactions Counter (LocalStorage)
        const savedLikes = JSON.parse(localStorage.getItem('amelia_photo_reactions') || '{}');
        const likeBtns = document.querySelectorAll('.photo-like-btn');

        likeBtns.forEach(btn => {
            const photoId = btn.getAttribute('data-photo-id');
            const countEl = btn.querySelector('.photo-like-count');

            if (photoId && savedLikes[photoId]) {
                if (countEl) countEl.textContent = savedLikes[photoId];
            }

            btn.addEventListener('click', (e) => {
                e.stopPropagation(); // Don't trigger lightbox on heart click
                const current = parseInt(countEl?.textContent || '0', 10);
                const next = current + 1;
                if (countEl) countEl.textContent = next;
                savedLikes[photoId] = next;
                localStorage.setItem('amelia_photo_reactions', JSON.stringify(savedLikes));

                // Spawn floating micro heart
                const heart = document.createElement('div');
                heart.classList.add('click-heart-particle');
                heart.innerHTML = '❤️';
                const rect = btn.getBoundingClientRect();
                heart.style.left = (rect.left + rect.width / 2) + 'px';
                heart.style.top = rect.top + 'px';
                document.body.appendChild(heart);
                setTimeout(() => heart.remove(), 1200);
            });
        });
    })();

    // ==========================================
    // 10. VISUAL EFFECTS (CONFETTI, HEARTS, CURSOR TRAIL)
    // ==========================================

    // Floating Confetti Cannon Button Listener
    const confettiCannonBtn = document.getElementById('confetti-cannon-btn');
    if (confettiCannonBtn) {
        confettiCannonBtn.addEventListener('click', () => {
            fireConfetti();
        });
    }

    // Global Click Spawn Floating Heart Everywhere
    window.addEventListener('click', (e) => {
        if (['INPUT', 'TEXTAREA', 'BUTTON'].includes(e.target.tagName)) return;
        const heart = document.createElement('div');
        heart.classList.add('click-heart-particle');
        const icons = ['❤️', '💖', '✨', '💐', '🎓', '🌸'];
        heart.innerHTML = icons[Math.floor(Math.random() * icons.length)];
        heart.style.left = e.clientX + 'px';
        heart.style.top = e.clientY + 'px';
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 1200);
    });

    // Custom Romantic Cursor Particle Trail (Desktop)
    let lastCursorMove = 0;
    if (window.matchMedia('(pointer: fine)').matches) {
        window.addEventListener('mousemove', (e) => {
            const now = Date.now();
            if (now - lastCursorMove < 50) return;
            lastCursorMove = now;

            const particle = document.createElement('div');
            particle.classList.add('cursor-trail-particle');
            particle.style.left = e.clientX + 'px';
            particle.style.top = e.clientY + 'px';
            document.body.appendChild(particle);
            setTimeout(() => particle.remove(), 800);
        });
    }

    function fireConfetti() {
        const colors = ['#7b5455', '#8c4b55', '#f4c2c2', '#ecbaba', '#ffbdc5'];
        const count = 65;
        for (let i = 0; i < count; i++) {
            const piece = document.createElement('div');
            piece.classList.add('confetti-piece');
            const size = Math.random() * 8 + 6;
            piece.style.width = size + 'px';
            piece.style.height = (size * 0.4) + 'px';
            piece.style.left = Math.random() * 100 + 'vw';
            piece.style.background = colors[Math.floor(Math.random() * colors.length)];
            piece.style.animationDuration = (Math.random() * 1.5 + 2) + 's';
            piece.style.animationDelay = (Math.random() * 0.3) + 's';
            piece.style.transform = `rotate(${Math.random() * 360}deg)`;
            document.body.appendChild(piece);
            setTimeout(() => piece.remove(), 4000);
        }
    }
    window.fireConfetti = fireConfetti;

    const celebrateBtn = document.getElementById('celebrate-btn');
    if (celebrateBtn) celebrateBtn.addEventListener('click', fireConfetti);

    const futureCard = document.getElementById('future-card');
    if (futureCard) {
        const futureObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    fireConfetti();
                    futureObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        futureObserver.observe(futureCard);
    }

    function createHeart() {
        const container = document.getElementById('heart-container');
        if (!container) return;
        const heart = document.createElement('span');
        heart.classList.add('material-symbols-outlined', 'floating-heart');
        heart.innerText = 'favorite';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.fontSize = (Math.random() * 20 + 10) + 'px';
        heart.style.animationDuration = (Math.random() * 3 + 3) + 's';

        container.appendChild(heart);
        setTimeout(() => heart.remove(), 6000);
    }
    setInterval(createHeart, 850);

    const scrollProgress = document.getElementById('scroll-progress');
    const backToTop = document.getElementById('back-to-top');
    const heroImg = document.getElementById('hero-img');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        if (scrollProgress) scrollProgress.style.width = pct + '%';

        if (backToTop) {
            if (scrollTop > 500) backToTop.classList.add('show');
            else backToTop.classList.remove('show');
        }

        if (heroImg) {
            heroImg.style.transform = `translateY(${scrollTop * 0.22}px) scale(1.1)`;
        }
    }, { passive: true });

    if (backToTop) {
        backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    const cursorGlow = document.getElementById('cursor-glow');
    if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
        window.addEventListener('mousemove', (e) => {
            cursorGlow.style.opacity = '1';
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
        });
        window.addEventListener('mouseleave', () => cursorGlow.style.opacity = '0');
    }

    document.querySelectorAll('.tilt-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rotateX = ((y / rect.height) - 0.5) * -8;
            const rotateY = ((x / rect.width) - 0.5) * 8;
            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    const timelineLine = document.getElementById('timeline-line');
    if (timelineLine) {
        const lineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    timelineLine.classList.add('active');
                    lineObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.05 });
        lineObserver.observe(document.getElementById('journey'));
    }

    // ==========================================
    // 11. WEBGL BACKGROUND SHADER
    // ==========================================
    (function initWebGLShader() {
        const canvas = document.getElementById('shader-canvas-ANIMATION_4');
        if (!canvas) return;

        function syncSize() {
            const w = canvas.clientWidth || 1280;
            const h = canvas.clientHeight || 720;
            if (canvas.width !== w || canvas.height !== h) {
                canvas.width = w;
                canvas.height = h;
            }
        }
        if (typeof ResizeObserver !== 'undefined') {
            new ResizeObserver(syncSize).observe(canvas);
        }
        syncSize();

        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) return;

        const vs = `attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;
        const fs = `precision highp float;
varying vec2 v_texCoord;
uniform float u_time;
uniform vec2 u_resolution;

float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

void main() {
    vec2 p = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    vec3 color = vec3(0.98, 0.97, 0.97);
    
    for(float i=0.0; i<15.0; i++) {
        float t = u_time * (0.1 + hash(vec2(i)) * 0.2);
        vec2 pos = vec2(
            sin(t + i * 1.4) * 0.8,
            cos(t * 0.7 + i * 2.1) * 0.8
        );
        
        float dist = length(p - pos);
        float size = 0.002 + 0.005 * hash(vec2(i, 1.0));
        float glow = size / (dist * dist + 0.001);
        
        vec3 petalColor = vec3(0.95, 0.76, 0.76); 
        color += petalColor * glow * 0.15;
    }
    
    gl_FragColor = vec4(color, 1.0);
}`;

        function cs(type, src) {
            const s = gl.createShader(type);
            gl.shaderSource(s, src);
            gl.compileShader(s);
            return s;
        }

        const prog = gl.createProgram();
        gl.attachShader(prog, cs(gl.VERTEX_SHADER, vs));
        gl.attachShader(prog, cs(gl.FRAGMENT_SHADER, fs));
        gl.linkProgram(prog);
        gl.useProgram(prog);

        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

        const pos = gl.getAttribLocation(prog, 'a_position');
        gl.enableVertexAttribArray(pos);
        gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

        const uTime = gl.getUniformLocation(prog, 'u_time');
        const uRes = gl.getUniformLocation(prog, 'u_resolution');

        function render(t) {
            if (typeof ResizeObserver === 'undefined') syncSize();
            gl.viewport(0, 0, canvas.width, canvas.height);
            if (uTime) gl.uniform1f(uTime, t * 0.001);
            if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            requestAnimationFrame(render);
        }
        render(0);
    })();

    // ==========================================
    // 12. REAL-TIME LIVE LYRICS TICKER
    // ==========================================
    const songLyricsMap = {
        'Ava Max feat. NCT 127': [
            { time: 0, text: '♪ So Am I - Ava Max ft. NCT 127' },
            { time: 4, text: '♪ Do you ever feel like a misfit?' },
            { time: 10, text: '♪ Everything you do is so iconic...' },
            { time: 18, text: '♪ Passing every test with flying colors!' },
            { time: 26, text: '♪ Congratulations S.Ak. Amelia Dwi Oktaviani! ❤️' }
        ],
        'NCT 127': [
            { time: 0, text: '♪ Dreams Come True - NCT 127' },
            { time: 4, text: '♪ Make your dreams come true...' },
            { time: 10, text: '♪ From quiet study nights to Yudisium S.Ak.' },
            { time: 18, text: '♪ On October 6th at Hotel Pullman Podomoro City! ✨' }
        ]
    };

    if (globalAudio) {
        globalAudio.addEventListener('timeupdate', () => {
            const lyricEl = document.getElementById('floating-lyric-line');
            if (!lyricEl || currentTrackIndex === -1) return;
            const track = tracksData[currentTrackIndex];
            const lyrics = songLyricsMap[track.artist] || songLyricsMap['NCT 127'];
            const currentTime = globalAudio.currentTime;

            let activeText = `♪ Playing ${track.title}...`;
            for (let i = lyrics.length - 1; i >= 0; i--) {
                if (currentTime >= lyrics[i].time) {
                    activeText = lyrics[i].text;
                    break;
                }
            }
            lyricEl.textContent = activeText;
        });
    }

    // ==========================================
    // 13. DIPLOMA CERTIFICATE PNG CANVAS EXPORTER (ULTRA LUXURY GOLD)
    // ==========================================
    (function initDiplomaExporter() {
        const downloadBtn = document.getElementById('download-diploma-btn');
        if (!downloadBtn) return;

        downloadBtn.addEventListener('click', () => {
            const canvas = document.createElement('canvas');
            canvas.width = 1600;
            canvas.height = 1066;
            const ctx = canvas.getContext('2d');

            // Rich Parchment & Champagne Background Gradient
            const bgGrad = ctx.createRadialGradient(800, 533, 100, 800, 533, 900);
            bgGrad.addColorStop(0, '#ffffff');
            bgGrad.addColorStop(0.6, '#fff7f7');
            bgGrad.addColorStop(1, '#ffdad9');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, 1600, 1066);

            // Double Gold Foil Outer Border
            const goldGrad = ctx.createLinearGradient(0, 0, 1600, 1066);
            goldGrad.addColorStop(0, '#b48358');
            goldGrad.addColorStop(0.3, '#fef08a');
            goldGrad.addColorStop(0.5, '#7b5455');
            goldGrad.addColorStop(0.8, '#fef08a');
            goldGrad.addColorStop(1, '#8c4b55');

            ctx.strokeStyle = goldGrad;
            ctx.lineWidth = 16;
            ctx.strokeRect(40, 40, 1520, 986);

            ctx.strokeStyle = '#d4c2c2';
            ctx.lineWidth = 4;
            ctx.strokeRect(60, 60, 1480, 946);

            ctx.strokeStyle = goldGrad;
            ctx.lineWidth = 2;
            ctx.strokeRect(70, 70, 1460, 926);

            // Ornate Corner Flourishes
            ctx.fillStyle = '#7b5455';
            ctx.font = '40px Georgia, serif';
            ctx.textAlign = 'left';
            ctx.fillText('🎕', 85, 115);
            ctx.textAlign = 'right';
            ctx.fillText('🎕', 1515, 115);
            ctx.textAlign = 'left';
            ctx.fillText('🎕', 85, 980);
            ctx.textAlign = 'right';
            ctx.fillText('🎕', 1515, 980);

            // University Header
            ctx.fillStyle = '#7b5455';
            ctx.font = 'bold 24px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('UNIVERSITAS CINTA & MASA DEPAN', 800, 150);

            ctx.font = 'italic 52px Georgia, serif';
            ctx.fillStyle = '#1b1c1c';
            ctx.fillText('Official Certificate of Accomplishment', 800, 220);

            ctx.fillStyle = '#7b5455';
            ctx.font = 'bold 20px Inter, sans-serif';
            ctx.fillText('BACHELOR OF ACCOUNTING (S.AK.) & QUEEN OF MY HEART', 800, 275);

            ctx.fillStyle = '#504444';
            ctx.font = 'italic 24px Inter, sans-serif';
            ctx.fillText('This Official Diploma is Proudly Conferred Upon', 800, 340);

            // Candidate Name (Large Gold/Rose Shadow)
            ctx.shadowColor = 'rgba(123, 84, 85, 0.3)';
            ctx.shadowBlur = 12;
            ctx.shadowOffsetY = 4;
            ctx.fillStyle = '#7b5455';
            ctx.font = 'bold 62px Georgia, serif';
            ctx.fillText('Amelia Dwi Oktaviani, S.Ak.', 800, 430);

            // Reset Shadow
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.shadowOffsetY = 0;

            // Line Separator with Diamond Center
            ctx.strokeStyle = goldGrad;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(500, 470);
            ctx.lineTo(1100, 470);
            ctx.stroke();

            // Degree Description
            ctx.fillStyle = '#303030';
            ctx.font = 'italic 26px Inter, sans-serif';
            ctx.fillText('Having successfully defended her undergraduate thesis, officially passed her', 800, 530);
            ctx.fillText('Yudisium in Accounting (S.Ak.) at Universitas Esa Unggul Kampus Bekasi,', 800, 575);
            ctx.fillText('and earned the eternal title of The Brightest Star & Soulmate for Life.', 800, 620);

            // Left Section: Venue & Date Info
            ctx.textAlign = 'left';
            ctx.fillStyle = '#7b5455';
            ctx.font = 'bold 22px Inter, sans-serif';
            ctx.fillText('OFFICIAL GRADUATION VENUE', 160, 750);
            ctx.fillStyle = '#1b1c1c';
            ctx.font = 'bold 24px Georgia, serif';
            ctx.fillText('Hotel PULLMAN Podomoro City', 160, 790);
            ctx.fillStyle = '#8c4b55';
            ctx.font = 'bold 20px Inter, sans-serif';
            ctx.fillText('Jakarta Barat • 6 October 2026', 160, 825);

            // Right Section: Signer Info
            ctx.textAlign = 'right';
            ctx.fillStyle = '#7b5455';
            ctx.font = 'bold 22px Inter, sans-serif';
            ctx.fillText('SIGNED WITH ENDLESS LOVE', 1440, 750);
            ctx.fillStyle = '#7b5455';
            ctx.font = 'bold italic 38px Georgia, serif';
            ctx.fillText('Ricki', 1440, 800);
            ctx.fillStyle = '#504444';
            ctx.font = '20px Inter, sans-serif';
            ctx.fillText('Your Forever Partner & Biggest Supporter', 1440, 835);

            // Center: Metallic Gold Wax Seal Badge
            ctx.beginPath();
            ctx.arc(800, 810, 60, 0, Math.PI * 2);
            ctx.fillStyle = '#881337';
            ctx.fill();
            ctx.strokeStyle = '#fef08a';
            ctx.lineWidth = 5;
            ctx.stroke();

            ctx.fillStyle = '#fef08a';
            ctx.font = 'bold 26px Georgia, serif';
            ctx.textAlign = 'center';
            ctx.fillText('S.Ak.', 800, 818);

            // Download Trigger
            const link = document.createElement('a');
            link.download = 'Amelia_Graduation_Certificate_SAk.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
            if (window.fireConfetti) window.fireConfetti();
        });
    })();

    // ==========================================
    // 14. IG STORY 9:16 CANVAS EXPORTER & MODAL
    // ==========================================
    (function initStoryModal() {
        const openBtn = document.getElementById('open-story-btn');
        const modal = document.getElementById('story-modal');
        const closeBtn = document.getElementById('story-modal-close');
        const downloadBtn = document.getElementById('download-story-btn');

        if (openBtn && modal) {
            openBtn.addEventListener('click', () => {
                modal.classList.remove('hidden');
                modal.classList.add('flex');
            });
        }
        if (closeBtn && modal) {
            closeBtn.addEventListener('click', () => {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
            });
        }
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.add('hidden');
                    modal.classList.remove('flex');
                }
            });
        }

        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                const canvas = document.createElement('canvas');
                canvas.width = 1080;
                canvas.height = 1920;
                const ctx = canvas.getContext('2d');

                const renderAndDownload = (photoImg) => {
                    // Background Gradient
                    const bgGrad = ctx.createLinearGradient(0, 0, 1080, 1920);
                    bgGrad.addColorStop(0, '#7b5455');
                    bgGrad.addColorStop(0.5, '#8c4b55');
                    bgGrad.addColorStop(1, '#1b1c1c');
                    ctx.fillStyle = bgGrad;
                    ctx.fillRect(0, 0, 1080, 1920);

                    // Decorative Ambient Glow Circle
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
                    ctx.beginPath();
                    ctx.arc(540, 450, 360, 0, Math.PI * 2);
                    ctx.fill();

                    // Top Badge
                    ctx.fillStyle = '#ffdad9';
                    ctx.font = 'bold 28px Inter, sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillText('YUDISIUM S.AK. PASSED • 6 OKTOBER 2026', 540, 160);

                    // Render Circular Photo of Amelia (if image loaded)
                    if (photoImg && photoImg.complete && photoImg.naturalWidth > 0) {
                        ctx.save();
                        ctx.beginPath();
                        ctx.arc(540, 360, 140, 0, Math.PI * 2, true);
                        ctx.closePath();
                        ctx.clip();
                        ctx.drawImage(photoImg, 540 - 140, 360 - 140, 280, 280);
                        ctx.restore();

                        // Circular Gold Border Frame
                        ctx.strokeStyle = '#fef08a';
                        ctx.lineWidth = 8;
                        ctx.beginPath();
                        ctx.arc(540, 360, 140, 0, Math.PI * 2);
                        ctx.stroke();
                    }

                    // Subtitle
                    ctx.fillStyle = '#f4c2c2';
                    ctx.font = '32px Inter, sans-serif';
                    ctx.fillText('CONGRATULATIONS SAYANGKU!', 540, 560);

                    // Main Title
                    ctx.fillStyle = '#ffffff';
                    ctx.font = 'bold 62px Georgia, serif';
                    ctx.fillText('Amelia Dwi Oktaviani, S.Ak.', 540, 650);

                    ctx.font = 'italic 34px Georgia, serif';
                    ctx.fillStyle = '#ffdad9';
                    ctx.fillText('Universitas Esa Unggul Kampus Bekasi', 540, 710);

                    // Quote Card Frame
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
                    if (ctx.roundRect) {
                        ctx.beginPath();
                        ctx.roundRect(140, 780, 800, 750, 30);
                        ctx.fill();
                    } else {
                        ctx.fillRect(140, 780, 800, 750);
                    }

                    ctx.fillStyle = '#ffffff';
                    ctx.font = 'italic 36px Georgia, serif';
                    ctx.fillText('"Defended with brilliance, officially passed', 540, 910);
                    ctx.fillText('Yudisium in Accounting (S.Ak.),', 540, 970);
                    ctx.fillText('and walking the stage at Hotel Pullman', 540, 1030);
                    ctx.fillText('Podomoro City on October 6th! ❤️"', 540, 1090);

                    ctx.font = 'bold 36px Georgia, serif';
                    ctx.fillStyle = '#f4c2c2';
                    ctx.fillText('— Forever Proud of You, Ricki', 540, 1260);

                    // Bottom Footer
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                    ctx.font = '26px Inter, sans-serif';
                    ctx.fillText('Grand Graduation Day • Hotel PULLMAN Podomoro City', 540, 1750);

                    // Download Trigger
                    const link = document.createElement('a');
                    link.download = 'Amelia_Graduation_IG_Story.png';
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                    if (window.fireConfetti) window.fireConfetti();
                };

                const photo = new Image();
                photo.crossOrigin = 'anonymous';
                photo.onload = () => renderAndDownload(photo);
                photo.onerror = () => renderAndDownload(null);
                photo.src = 'amel.jpeg';
            });
        }
    })();

    // ==========================================
    // 15. RETRO CASSETTE AI VOICE NOTE PLAYER
    // ==========================================
    (function initAIVoiceNote() {
        const playBtn = document.getElementById('vn-play-btn');
        const playIcon = document.getElementById('vn-play-icon');
        const playText = document.getElementById('vn-play-text');
        const stopBtn = document.getElementById('vn-stop-btn');
        const speedSelect = document.getElementById('vn-speed-select');
        const reelLeft = document.getElementById('cassette-reel-left');
        const reelRight = document.getElementById('cassette-reel-right');
        const progressBar = document.getElementById('vn-progress-bar');
        const transcriptText = document.getElementById('vn-transcript-text');
        const eqBars = document.querySelectorAll('.eq-bar-vn');
        const timeCurrent = document.getElementById('vn-time-current');
        const timeTotal = document.getElementById('vn-time-total');

        const audio = new Audio('assets/audio/prabowo-voice.mp3');
        let isPlaying = false;
        let progressInterval = null;
        let eqInterval = null;

        function formatTime(sec) {
            if (!sec || isNaN(sec)) return '0:00';
            const m = Math.floor(sec / 60);
            const s = Math.floor(sec % 60);
            return `${m}:${s < 10 ? '0' : ''}${s}`;
        }

        audio.addEventListener('loadedmetadata', () => {
            if (timeTotal) timeTotal.textContent = formatTime(audio.duration);
        });

        function setReels(spinning) {
            if (spinning) {
                reelLeft?.classList.add('spinning');
                reelRight?.classList.add('spinning');
            } else {
                reelLeft?.classList.remove('spinning');
                reelRight?.classList.remove('spinning');
            }
        }

        function setEQ(active) {
            eqBars.forEach((bar, idx) => {
                if (active) {
                    const h = Math.floor(Math.random() * 22 + 4);
                    bar.style.height = h + 'px';
                } else {
                    bar.style.height = (idx % 2 === 0 ? '6px' : '12px');
                }
            });
        }

        function startPlayback() {
            const speed = parseFloat(speedSelect?.value || '1.0');
            audio.playbackRate = speed;
            audio.currentTime = 0;

            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    isPlaying = true;
                    if (playIcon) playIcon.textContent = 'pause';
                    if (playText) playText.textContent = 'Jeda Suara ⏸️';
                    setReels(true);
                    if (transcriptText) {
                        transcriptText.classList.add('text-amber-900', 'font-extrabold', 'not-italic');
                    }

                    clearInterval(progressInterval);
                    progressInterval = setInterval(() => {
                        if (audio.duration) {
                            const pct = (audio.currentTime / audio.duration) * 100;
                            if (progressBar) progressBar.style.width = pct + '%';
                            if (timeCurrent) timeCurrent.textContent = formatTime(audio.currentTime);
                            if (timeTotal) timeTotal.textContent = formatTime(audio.duration);
                        }
                    }, 100);

                    clearInterval(eqInterval);
                    eqInterval = setInterval(() => setEQ(true), 120);
                }).catch(err => {
                    console.warn('Audio play error, trying fallback:', err);
                    audio.src = 'assets/audio/prabowo-voice.mp3.mpeg';
                    audio.play().then(() => {
                        isPlaying = true;
                        if (playIcon) playIcon.textContent = 'pause';
                        if (playText) playText.textContent = 'Jeda Suara ⏸️';
                        setReels(true);
                    }).catch(() => {
                        alert('Silakan klik tombol sekali lagi untuk memutar suara!');
                    });
                });
            }
        }

        function stopPlayback() {
            isPlaying = false;
            audio.pause();
            audio.currentTime = 0;
            if (playIcon) playIcon.textContent = 'play_arrow';
            if (playText) playText.textContent = 'Putar Suara 🎙️';
            setReels(false);
            setEQ(false);
            clearInterval(progressInterval);
            clearInterval(eqInterval);
            if (progressBar) progressBar.style.width = '0%';
            if (timeCurrent) timeCurrent.textContent = '0:00';
            if (transcriptText) {
                transcriptText.classList.remove('text-amber-900', 'font-extrabold', 'not-italic');
            }
        }

        audio.addEventListener('ended', () => {
            stopPlayback();
            if (progressBar) progressBar.style.width = '100%';
        });

        if (playBtn) {
            playBtn.addEventListener('click', () => {
                if (isPlaying) {
                    audio.pause();
                    isPlaying = false;
                    if (playIcon) playIcon.textContent = 'play_arrow';
                    if (playText) playText.textContent = 'Lanjutkan 🎙️';
                    setReels(false);
                    setEQ(false);
                    clearInterval(progressInterval);
                    clearInterval(eqInterval);
                } else if (audio.currentTime > 0 && !audio.ended) {
                    audio.play().then(() => {
                        isPlaying = true;
                        if (playIcon) playIcon.textContent = 'pause';
                        if (playText) playText.textContent = 'Jeda Suara ⏸️';
                        setReels(true);
                        eqInterval = setInterval(() => setEQ(true), 120);
                    }).catch(() => {
                        startPlayback();
                    });
                } else {
                    startPlayback();
                }
            });
        }

        if (stopBtn) {
            stopBtn.addEventListener('click', () => {
                stopPlayback();
            });
        }

        if (speedSelect) {
            speedSelect.addEventListener('change', () => {
                const speed = parseFloat(speedSelect.value);
                audio.playbackRate = speed;
            });
        }
    })();

    // ==========================================
    // 16. QR CODE CARD MODAL FOR TAMU & KELUARGA
    // ==========================================
    (function initQRCodeModal() {
        const modal = document.getElementById('qr-modal');
        const closeBtn = document.getElementById('qr-modal-close');
        const openBtns = document.querySelectorAll('.open-qr-modal-btn');
        const qrImg = document.getElementById('qr-code-img');
        const qrLoading = document.getElementById('qr-loading');
        const jumpGuestbookBtn = document.getElementById('qr-jump-guestbook');
        const copyLinkBtn = document.getElementById('qr-copy-link-btn');
        const urlInput = document.getElementById('qr-url-input');
        const updateUrlBtn = document.getElementById('qr-update-url-btn');

        function getAccessibleUrl() {
            let href = window.location.href;
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                return 'https://rickigilang3-droid.github.io/AmeliaSayangku/';
            }
            return href;
        }

        function generateQR(customUrl) {
            if (!qrImg) return;
            const targetUrl = customUrl || (urlInput ? urlInput.value.trim() : getAccessibleUrl());
            if (urlInput && !customUrl) {
                urlInput.value = targetUrl;
            }

            const encodedUrl = encodeURIComponent(targetUrl);
            const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedUrl}&color=7b5455&bgcolor=ffffff`;

            if (qrLoading) qrLoading.style.display = 'flex';
            qrImg.onload = () => {
                if (qrLoading) qrLoading.style.display = 'none';
            };
            qrImg.src = qrApiUrl;
        }

        if (updateUrlBtn && urlInput) {
            updateUrlBtn.addEventListener('click', () => {
                generateQR(urlInput.value.trim());
            });
            urlInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    generateQR(urlInput.value.trim());
                }
            });
        }

        openBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (modal) {
                    modal.classList.remove('hidden');
                    modal.classList.add('flex');
                    generateQR();
                }
            });
        });

        if (closeBtn && modal) {
            closeBtn.addEventListener('click', () => {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
            });
        }

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.add('hidden');
                    modal.classList.remove('flex');
                }
            });
        }

        if (jumpGuestbookBtn) {
            jumpGuestbookBtn.addEventListener('click', () => {
                if (modal) {
                    modal.classList.add('hidden');
                    modal.classList.remove('flex');
                }
                const guestbookEl = document.getElementById('guestbook');
                if (guestbookEl) {
                    guestbookEl.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }

        if (copyLinkBtn) {
            copyLinkBtn.addEventListener('click', () => {
                const textToCopy = urlInput ? urlInput.value.trim() : getAccessibleUrl();
                navigator.clipboard.writeText(textToCopy).then(() => {
                    const originalText = copyLinkBtn.innerHTML;
                    copyLinkBtn.innerHTML = '<span class="material-symbols-outlined text-base">check</span> Tersalin!';
                    setTimeout(() => {
                        copyLinkBtn.innerHTML = originalText;
                    }, 2000);
                });
            });
        }
    })();

    // ==========================================
    // 17. REALTIME CROSS-DEVICE WISH SYNCING
    // ==========================================
    (function initRealtimeGuestbookSync() {
        // BroadcastChannel API for multi-tab / local network sync
        const channel = (typeof BroadcastChannel !== 'undefined') ? new BroadcastChannel('amelia_wish_channel') : null;

        if (channel) {
            channel.onmessage = (event) => {
                if (event.data && event.data.type === 'NEW_WISH') {
                    const wishData = event.data.wish;
                    appendRealtimeWishCard(wishData);
                }
            };
        }

        // Listen to form submit & broadcast
        const guestbookForm = document.getElementById('guestbook-form');
        if (guestbookForm) {
            guestbookForm.addEventListener('submit', (e) => {
                const nameInput = document.getElementById('guest-name');
                const messageInput = document.getElementById('guest-message');
                if (!nameInput || !messageInput) return;

                const name = nameInput.value.trim();
                const message = messageInput.value.trim();
                if (!name || !message) return;

                const wishObj = {
                    name,
                    message,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    date: 'Hari H Wisuda'
                };

                if (channel) {
                    channel.postMessage({ type: 'NEW_WISH', wish: wishObj });
                }
            });
        }

        function appendRealtimeWishCard(wish) {
            const wishesContainer = document.getElementById('wishes-container');
            if (!wishesContainer) return;

            const card = document.createElement('div');
            card.className = 'glass-panel p-6 rounded-2xl romantic-shadow border-2 border-primary/40 bg-gradient-to-r from-white via-primary-container/20 to-white reveal active animate-pulse';
            card.innerHTML = `
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-2">
                        <div class="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs">
                            ${wish.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p class="font-bold text-sm text-on-surface">${wish.name}</p>
                            <p class="text-[10px] text-tertiary font-bold">Baru Saja • Live ⚡</p>
                        </div>
                    </div>
                    <span class="material-symbols-outlined text-primary text-lg" data-weight="fill">favorite</span>
                </div>
                <p class="text-on-surface-variant text-sm italic leading-relaxed">"${wish.message}"</p>
            `;

            wishesContainer.prepend(card);
            if (window.fireConfetti) window.fireConfetti();
        }
    })();

});



