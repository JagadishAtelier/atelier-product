document.addEventListener('DOMContentLoaded', function () {
    // Select both the new class and the old ID for compatibility
    const forms = document.querySelectorAll('.js-ajax-form, #contactForm');

    forms.forEach(form => {
        // Prevent attaching multiple listeners if an element matches both selector and ID
        if (form.dataset.ajaxAttached === 'true') return;
        attachFormHandler(form);
        form.dataset.ajaxAttached = 'true';
    });
});

function attachFormHandler(form) {
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        let submitBtn = form.querySelector('button[type="submit"]');
        if (!submitBtn) {
            submitBtn = form.querySelector('input[type="submit"]');
        }

        let originalBtnText = '';

        if (submitBtn) {
            if (submitBtn.tagName === 'INPUT') {
                originalBtnText = submitBtn.value;
                submitBtn.value = 'Sending...';
            } else {
                originalBtnText = submitBtn.innerText;
                submitBtn.innerText = 'Sending...';
            }
            submitBtn.disabled = true;
        }

        // Collect data
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => data[key] = value);

        // Add source information
        data['source'] = window.location.href;

        // Google Apps Script Web App URL
        const scriptURL = 'https://script.google.com/macros/s/AKfycbzAn1sUOgCLC_rTxT6d8SV_eQC-vdfxHPP4C6A5nJDQLhObS1ozEDYTBS1RgCfz_Hoyxw/exec';

        if (scriptURL === 'YOUR_GOOGLE_SCRIPT_WEB_APP_URL_HERE') {
            alert('Please configure the Google Apps Script URL in assets/contact-form.js');
            if (submitBtn) {
                if (submitBtn.tagName === 'INPUT') {
                    submitBtn.value = originalBtnText;
                } else {
                    submitBtn.innerText = originalBtnText;
                }
                submitBtn.disabled = false;
            }
            return;
        }

        fetch(scriptURL, {
            method: 'POST',
            body: new URLSearchParams(data)
        })
            .then(response => {
                alert('Thank you! Your message has been sent.');
                form.reset();
            })
            .catch(error => {
                console.error('Error!', error.message);
                alert('Error sending message. Please ensure your Google App Script deployment is set to "Who has access: Anyone". Check the console for more details.');
            })
            .finally(() => {
                if (submitBtn) {
                    if (submitBtn.tagName === 'INPUT') {
                        submitBtn.value = originalBtnText;
                    } else {
                        submitBtn.innerText = originalBtnText;
                    }
                    submitBtn.disabled = false;
                }
            });
    });
}
