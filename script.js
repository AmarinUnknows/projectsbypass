function copyToClipboard(text) {
	try {
		navigator.clipboard.writeText(text).then(function () {
			toast('คัดลอกแล้ว');
		}).catch(function () {
			fallbackCopy(text);
		});
	} catch (e) {
		fallbackCopy(text);
	}
}

function fallbackCopy(text) {
	var textarea = document.createElement('textarea');
	textarea.value = text;
	textarea.style.position = 'fixed';
	textarea.style.opacity = '0';
	document.body.appendChild(textarea);
	textarea.focus();
	textarea.select();
	try {
		document.execCommand('copy');
		toast('คัดลอกแล้ว');
	} catch (err) {
		alert('คัดลอกไม่สำเร็จ: ' + err);
	}
	document.body.removeChild(textarea);
}

function toast(message) {
	var el = document.createElement('div');
	el.textContent = message;
	el.style.position = 'fixed';
	el.style.left = '50%';
	el.style.bottom = '30px';
	el.style.transform = 'translateX(-50%)';
	el.style.background = 'rgba(15,23,42,0.95)';
	el.style.color = '#e2e8f0';
	el.style.border = '1px solid #23324d';
	el.style.borderRadius = '10px';
	el.style.padding = '10px 14px';
	el.style.fontWeight = '600';
	el.style.zIndex = '9999';
	el.style.boxShadow = '0 10px 30px rgba(0,0,0,0.35)';
	document.body.appendChild(el);
	setTimeout(function () { el.style.opacity = '0'; el.style.transition = 'opacity .3s'; }, 1400);
	setTimeout(function () { document.body.removeChild(el); }, 1800);
}

document.addEventListener('DOMContentLoaded', function () {
	var copyButtons = document.querySelectorAll('button[data-copy]');
	copyButtons.forEach(function (btn) {
		btn.addEventListener('click', function () {
			var link = btn.getAttribute('data-copy');
			copyToClipboard(link);
		});
	});

	var copySite = document.getElementById('copySite');
	if (copySite) {
		copySite.addEventListener('click', function () {
			copyToClipboard(window.location.href);
		});
	}
});


