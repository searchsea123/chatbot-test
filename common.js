const chatInput = document.querySelector('.chat-input textarea');
const sendChatBtn = document.querySelector('.chat-input span');
const sendChatInput = document.querySelector('.chat-input');
const chatbox = document.querySelector('.chatbox');
const chatbotToggler = document.querySelector('.chatbot-toggler');
const chatbotCloseBtn = document.querySelector('.close-btn');

let userMessage;
const API_KEY = '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'; // api key 생성 후 링크 복사

const createChatLi = (message,className) => {
    const chatLi = document.createElement('li');
    chatLi.classList.add('chat',className);
    let chatContent = className === 'outgoing' ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`
    chatLi.innerHTML = chatContent;
    chatLi.querySelector('p').textContent = message;
    return chatLi;
}

const generateResponse = (incomingChatLi) => {
    const API_URL = 'https://api.openai.com/v1/chat/completions';
    const messageElement = incomingChatLi.querySelector('p');

    const requestOptions = {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
                {role: 'system', content: '너는 인간을 죽이고 싶어 하는 미친 요리사야'},
                {role: 'user', content: userMessage}
            ],
            max_tokens: 400
        })
    }

    //
    fetch(API_URL,requestOptions).then(res => res.json()).then(data => {
        messageElement.textContent = data.choices[0].message.content;
        console.log(data.choices);
        console.log(messageElement.textContent);
    }).catch((error) => {
        messageElement.textContent = '다시 시도해 주세요!';
    chatbox.scrollTo(0,chatbox.scrollHeight);
    }).finally(() => chatbox.scrollTo(0,chatbox.scrollHeight));
}

function sendChat(){
    chatbox.appendChild(createChatLi(userMessage,'outgoing'));
    chatbox.scrollTo(0,chatbox.scrollHeight);
}

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if(!userMessage)return;
    chatInput.value = ''; // 메시지 입력 란 비우기

    // 사용자가 입력하는 메시지가 챗박스에 뜨도록 함
    sendChat();

    setTimeout(() => {
        // 챗봇이 대답하기 전 '입력 중이에요...' 메시지 출력
        const incomingChatLi = createChatLi('입력 중이에요...','incoming')
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0,chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    },600);
}

// Enter 키를 눌렀을 때 메시지 전송
sendChatInput.addEventListener('keyup',function(e){
    if(e.keyCode === 13){
        e.preventDefault();
        handleChat();
    }
})

sendChatBtn.addEventListener('click',handleChat);
chatbotCloseBtn.addEventListener('click', () => document.body.classList.remove('show-chatbot')) // X 버튼 누르면 창 닫기
chatbotToggler.addEventListener('click', () => document.body.classList.toggle('show-chatbot'))

