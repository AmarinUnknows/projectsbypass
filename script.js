// Interactive enhancements: parallax tilt on cards and scroll-reveal
document.addEventListener('DOMContentLoaded', function () {
	var cards = document.querySelectorAll('.video-card');
	cards.forEach(function (card) {
		card.style.transformStyle = 'preserve-3d';
		card.style.willChange = 'transform';
		card.addEventListener('mousemove', function (e) {
			var rect = card.getBoundingClientRect();
			var x = e.clientX - rect.left;
			var y = e.clientY - rect.top;
			var rotateY = (x / rect.width - 0.5) * 6;
			var rotateX = (0.5 - y / rect.height) * 6;
			card.style.transform = 'perspective(900px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
		});
		card.addEventListener('mouseleave', function () {
			card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
		});
	});

	var observer = new IntersectionObserver(function (entries) {
		entries.forEach(function (entry) {
			if (entry.isIntersecting) {
				entry.target.style.opacity = '1';
				entry.target.style.transform += ' translateY(0)';
				observer.unobserve(entry.target);
			}
		});
	}, { threshold: 0.15 });

	cards.forEach(function (card) {
		card.style.opacity = '0';
		card.style.transform = (card.style.transform || '') + ' translateY(12px)';
		card.style.transition = 'transform .5s ease, opacity .5s ease';
		observer.observe(card);
	});

	// Reduce motion preference
	var mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
	if (mediaQuery.matches) {
		cards.forEach(function (card) {
			card.style.transition = 'opacity .4s ease';
			card.onmousemove = null;
		});
		document.documentElement.style.setProperty('--disable-animations', 'true');
	}

	// Loading overlay progression
	var loader = document.getElementById('loader');
	var bar = document.getElementById('progressBar');
	if (loader && bar) {
		var progress = 0;
		var increment = mediaQuery.matches ? 33 : 4; // fewer steps if reduced motion
		var interval = setInterval(function () {
			progress = Math.min(100, progress + increment);
			bar.style.width = progress + '%';
			if (progress >= 100) {
				clearInterval(interval);
				// Wait for images/iframes to settle or a small timeout
				var hide = function () {
					loader.classList.add('is-hidden');
					showPromoModal();
				};
				if (document.readyState === 'complete') {
					setTimeout(hide, 250);
				} else {
					window.addEventListener('load', function () { setTimeout(hide, 250); });
				}
			}
		}, 60);
	}

	// Register service worker
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.register('service-worker.js').catch(function (err) {
			console.warn('SW registration failed:', err);
		});
	}

	// Iframe watchdog: if Drive preview doesn't load, show fallback helpers
	var frames = document.querySelectorAll('.video-frame iframe');
	frames.forEach(function (frame) {
		try {
			var parent = frame.parentElement;
			var note = parent.querySelector('.video-fallback');
			if (!note) return;
			var timer = setTimeout(function () {
				note.style.opacity = '1';
			}, 5000);
			frame.addEventListener('load', function () {
				clearTimeout(timer);
				note.style.opacity = '0';
			});
		} catch (_) {}
	});

	// Scroll progress bar
	var progressBar = document.getElementById('scrollProgress');
	if (progressBar) {
		var ticking = false;
		var update = function () {
			var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
			var docHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) - window.innerHeight;
			var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
			progressBar.style.width = pct + '%';
			ticking = false;
		};
		window.addEventListener('scroll', function () {
			if (!ticking) {
				window.requestAnimationFrame(update);
				ticking = true;
			}
		});
		update();
	}

	// Ambient glow follows cursor on hover
	cards.forEach(function (card) {
		var frame = card.querySelector('.video-frame');
		if (!frame) return;
		card.addEventListener('mousemove', function (e) {
			var rect = frame.getBoundingClientRect();
			var mx = ((e.clientX - rect.left) / rect.width) * 100 + '%';
			var my = ((e.clientY - rect.top) / rect.height) * 100 + '%';
			frame.style.setProperty('--mx', mx);
			frame.style.setProperty('--my', my);
		});
	});

	// Mouse-follow parallax for background layers
	var parallaxLayer = document.querySelector('.parallax-layer');
	var orbsLayer = document.querySelector('.orbs');
	if (parallaxLayer || orbsLayer) {
		var px = 0, py = 0, rafPending = false;
		var onMove = function (e) {
			if (mediaQuery.matches) return; // respect reduced motion
			var vw = window.innerWidth;
			var vh = window.innerHeight;
			px = (e.clientX / vw - 0.5);
			py = (e.clientY / vh - 0.5);
			if (!rafPending) {
				rAF();
				rafPending = true;
			}
		};
		var rAF = function () {
			var tx1 = (px * 12).toFixed(2);
			var ty1 = (py * 10).toFixed(2);
			var tx2 = (-px * 8).toFixed(2);
			var ty2 = (-py * 6).toFixed(2);
			if (parallaxLayer) parallaxLayer.style.transform = 'translate(' + tx1 + 'px,' + ty1 + 'px)';
			if (orbsLayer) orbsLayer.style.transform = 'translate(' + tx2 + 'px,' + ty2 + 'px)';
			rafPending = false;
		};
		window.addEventListener('mousemove', onMove);
	}

	// Promo modal
	function showPromoModal() {
		var modal = document.getElementById('promoModal');
		if (!modal) return;
		modal.classList.add('is-open');
		modal.setAttribute('aria-hidden', 'false');
		modal.addEventListener('click', function (e) {
			if (e.target.hasAttribute('data-close')) {
				closePromoModal();
			}
		});
		var closeBtn = modal.querySelector('.modal-close');
		if (closeBtn) closeBtn.addEventListener('click', closePromoModal);
		function closePromoModal() {
			modal.classList.remove('is-open');
			modal.setAttribute('aria-hidden', 'true');
		}
	}
});


