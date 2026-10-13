/**
 * Suraksha360 - Core Interactive Application Logic
 * Manages contacts, address, profile, alerts & emergency triggers
 */

document.addEventListener('DOMContentLoaded', () => {

    // ================= 1. Contacts Manager =================
    const contactForm = document.getElementById('contactForm');
    const contactList = document.getElementById('contactList');

    if (contactForm && contactList) {
        // Load saved contacts or default
        const defaultContacts = [
            { name: "Mom", phone: "+91 9876543210" },
            { name: "Bestie", phone: "+91 9988776655" },
            { name: "Police Station", phone: "100" }
        ];

        function getStoredContacts() {
            try {
                const stored = localStorage.getItem('suraksha360_contacts');
                return stored ? JSON.parse(stored) : defaultContacts;
            } catch (e) {
                return defaultContacts;
            }
        }

        function saveContacts(contacts) {
            try {
                localStorage.setItem('suraksha360_contacts', JSON.stringify(contacts));
            } catch (e) {
                // LocalStorage unavailable
            }
        }

        function renderContacts() {
            const contacts = getStoredContacts();
            contactList.innerHTML = '';
            contacts.forEach((contact, index) => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <div class="contact-info">
                        <span class="contact-name">${contact.name}</span>
                        <span class="contact-number">${contact.phone}</span>
                    </div>
                    <div class="contact-actions">
                        <a href="tel:${contact.phone.replace(/\s+/g, '')}" class="call-button" title="Call">📞 Call</a>
                        <button class="delete-button" data-index="${index}">Delete</button>
                    </div>
                `;
                contactList.appendChild(li);
            });

            // Attach delete listeners
            contactList.querySelectorAll('.delete-button').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const idx = parseInt(e.target.getAttribute('data-index'), 10);
                    const current = getStoredContacts();
                    current.splice(idx, 1);
                    saveContacts(current);
                    renderContacts();
                });
            });
        }

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameInput = document.getElementById('contactName');
            const phoneInput = document.getElementById('contactPhone');

            if (nameInput && phoneInput) {
                const name = nameInput.value.trim();
                const phone = phoneInput.value.trim();

                if (name && phone) {
                    const contacts = getStoredContacts();
                    contacts.push({ name, phone });
                    saveContacts(contacts);
                    renderContacts();
                    contactForm.reset();
                }
            }
        });

        renderContacts();
    }

    // ================= 2. Registered Information Form =================
    const regForm = document.getElementById('registrationForm');
    if (regForm) {
        regForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const phone = document.getElementById('phone')?.value || '';
            const emergency = document.getElementById('emergency')?.value || '';
            const altContact = document.getElementById('alternative_contact')?.value || '';
            const phonePattern = /^[0-9]{10}$/;

            if (!phonePattern.test(phone) || !phonePattern.test(emergency) || !phonePattern.test(altContact)) {
                alert('Please enter valid 10-digit phone numbers.');
                return;
            }

            alert('🎉 Emergency Profile Registered Successfully!');
            regForm.reset();
        });
    }

    // ================= 3. Address Update Form =================
    const addressForm = document.getElementById('addressForm');
    const addressDisplay = document.getElementById('addressDisplay');
    if (addressForm && addressDisplay) {
        addressForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const house = document.getElementById('house')?.value || '';
            const street = document.getElementById('street')?.value || '';
            const city = document.getElementById('city')?.value || '';
            const state = document.getElementById('state')?.value || '';
            const pincode = document.getElementById('pincode')?.value || '';
            const country = document.getElementById('country')?.value || '';

            const newAddress = `H.No: ${house}, ${street},<br>${city},<br>${state} - ${pincode}, ${country}`;
            addressDisplay.innerHTML = newAddress;
            try {
                localStorage.setItem('suraksha360_address', newAddress);
            } catch (err) {}
            addressForm.reset();
            alert('Safe-haven address updated successfully.');
        });
    }

    // ================= 4. Alerts Toggles Persistence =================
    const soundToggle = document.getElementById('soundNotification');
    const smsToggle = document.getElementById('smsNotification');
    const locationToggle = document.getElementById('autoShareLocation');

    if (soundToggle || smsToggle || locationToggle) {
        [soundToggle, smsToggle, locationToggle].forEach(toggle => {
            if (toggle) {
                const key = 'suraksha360_' + toggle.id;
                const saved = localStorage.getItem(key);
                if (saved !== null) {
                    toggle.checked = saved === 'true';
                }
                toggle.addEventListener('change', () => {
                    localStorage.setItem(key, toggle.checked);
                });
            }
        });
    }
});
