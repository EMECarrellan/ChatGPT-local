import { CreateWebWorkerMLCEngine } from "https://esm.run/@mlc-ai/web-llm";

const $ = (el) => document.querySelector(el);


const $form = $('form');
const $input = $('input');
const $template = $('#message-template');
const $messages = $('ul');
const $container = $('main');
const $button = $('button');
const $info = $('small');

let messages = [];

const SELECTED_MODEL = 'Phi-3-mini-4k-instruct-q4f16_1-MLC-1k';

const engine = await CreateWebWorkerMLCEngine(
    new Worker('/JS/worker.js', { type: 'module' }),
    SELECTED_MODEL,
    {
        initProgressCallback: (info) => {
            $info.textContent = `${info.text}`;
            if (info.progress === 1) {
                $button.removeAttribute('disabled');
            }
        }
    }
)

$form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const messageText = $input.value.trim();

    if (messageText !== '') {
        $input.value = '';
    }

    addMessage(messageText, 'user');
    $button.setAttribute('disabled', true);

    const userMessage = {
        role: 'user',
        content: messageText
    }

    messages.push(userMessage);

    const chunks = await engine.chat.completions.create({
        messages,
        stream: true
    })

    let reply = "";

    const $botMessage = addMessage("", 'bot')

    for await (const chunk of chunks) {
        const [choice] = chunk.choices;
        const content = choice?.delta?.content ?? "";
        reply += content;
        $botMessage.textContent = reply;
        $container.scrollTop = $container.scrollHeight;
    }

    $button.removeAttribute('disabled');
    messages.push({
        role: 'assistant',
        content: reply
    })
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
    
    $container.scrollTop = $container.scrollHeight;

    return $text;
}