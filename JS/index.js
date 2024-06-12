const $ = (el) => document.querySelector(el);

const $form = $('form');
const $input = $('input');
const $template = $('#message-template');
const $messages = $('ul');
const $container = $('main');
const $button = $('button');

$form.addEventListener('submit', (event) => {
    event.preventDefault();
    const messageText = $input.value.trim();

    if (messageText !== '') {
        $input.value = '';
    }

    addMessage(messageText, 'user')
})

function addMessage(text, sender) {
    const clonedTemplate = $template.content.cloneNode(true);
    const $newMessage = clonedTemplate.querySelector('.message');

    const $who = $newMessage.querySelector('span');
    const $text = $newMessage.querySelector('p');

    $text.textContent = text;
    $who.textContent = sender === 'bot' ? 'EIA' : 'Tú';
    $newMessage.classList.add(sender);

    $messages.appendChild($newMessage);
}