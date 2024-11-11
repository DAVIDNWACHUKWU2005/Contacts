"use strict";

// Utility functions
function select(selector, scope = document) {
    return scope.querySelector(selector);
}

function listen(event, element, callback) {
    return element.addEventListener(event, callback);
}

const contacts = [];
const contactCountMessage = select(".contact-count .contacts-num");
const emailError = select(".email-error");
const formatError = select(".format-error");
const inputElement = select(".contact-input");
const addContactButton = select("input[name='add-contacts']");
const contactList = select(".contact-list");

class Contact {
    #name;
    #city;
    #email;

    constructor(name, city, email) {
        this.#name = name;
        this.#city = city;
        this.#email = email;
    }

    getName() {
        return this.#name;
    }

    getCity() {
        return this.#city;
    }

    getEmail() {
        return this.#email;
    }
}

// Validate email format
function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

// Display error messages
function displayError(errorType) {
    contactCountMessage.classList.add("hidden");

    if (errorType === "email") {
        emailError.classList.remove("hidden");
        formatError.classList.add("hidden");
    } else {
        formatError.classList.remove("hidden");
        emailError.classList.add("hidden");
    }
}

// Hide error messages
function hideErrors() {
    emailError.classList.add("hidden");
    formatError.classList.add("hidden");
    contactCountMessage.classList.remove("hidden");
}

function validateInput(input) {
    const parts = input.split(",");
    if (parts.length !== 3) {
        displayError("format");
        return false;
    }

    const name = parts[0]?.trim();
    const city = parts[1]?.trim();
    const email = parts[2]?.trim();

    if (!name || !city || !email) {
        displayError("format");
        return false;
    }

    if (!isValidEmail(email)) {
        displayError("email");
        return false;
    }

    return { name, city, email };
}

// Add contact to the list
function addContact() {
    const input = inputElement.value;
    const validatedInput = validateInput(input);

    if (!validatedInput) {
        return;
    }

    hideErrors(); // Hide errors after successful validation

    const { name, city, email } = validatedInput;
    const newContact = new Contact(name, city, email);
    
    contacts.unshift(newContact);
    inputElement.value = "";
    listContacts();
}

// Update contact count display function
function updateContactCount() {
    contactCountMessage.textContent = `Total Contacts: ${contacts.length}`;
    contactCountMessage.classList.remove("hidden");
}

listen("click", addContactButton, addContact);

function listContacts() {
    contactList.innerHTML = "";

    contacts.forEach((contact, index) => {
        const contactDiv = document.createElement("div");
        contactDiv.className = "contact-box";
        contactDiv.innerHTML = `
            <p><span class="title">Name:</span> ${contact.getName()}</p>
            <p><span class="title">City:</span> ${contact.getCity()}</p>
            <p><span class="title">Email:</span> ${contact.getEmail()}</p>
        `;

       
        listen("click", contactDiv, () => deleteContact(index));
        contactList.appendChild(contactDiv);
    });

    updateContactCount();
}


function deleteContact(index) {
    contacts.splice(index, 1);
    listContacts(); 
}
