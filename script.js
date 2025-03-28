document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const themeToggle = document.getElementById('theme-toggle');

    // Check for saved theme preference or use default
    if (localStorage.getItem('darkTheme') === 'true') {
        document.body.classList.add('dark-theme');
    }

    // Predefined Q&A pairs organized by categories
    const qaPairs = {
        // 1️⃣ General Conversation
        general: [
            {
                questions: ["halo", "hai", "hello", "hi"],
                answer: "Halo! Ada yang bisa saya bantu?"
            },
            {
                questions: ["apa kabar", "bagaimana kabarmu"],
                answer: "Saya adalah AI, jadi saya selalu baik! 😁"
            },
            {
                questions: ["siapa kamu", "kamu siapa", "siapa namamu"],
                answer: "Saya adalah chatbot yang bisa membantu menjawab pertanyaanmu!"
            },
            {
                questions: ["terima kasih", "makasih", "thanks"],
                answer: "Sama-sama! Jika butuh bantuan lagi, tanyakan saja. 😊"
            },
            {
                questions: ["selamat tinggal", "bye", "sampai jumpa"],
                answer: "Sampai jumpa! Semoga harimu menyenangkan!"
            }
        ],

        // 2️⃣ Technology Questions
        technology: [
            {
                questions: ["apa itu ai", "ai itu apa", "kecerdasan buatan"],
                answer: "AI atau Kecerdasan Buatan adalah teknologi yang membuat mesin bisa berpikir seperti manusia!"
            },
            {
                questions: ["apa itu javascript", "javascript itu apa"],
                answer: "JavaScript adalah bahasa pemrograman yang digunakan untuk membuat website lebih interaktif."
            },
            {
                questions: ["apa itu html", "html itu apa"],
                answer: "HTML adalah bahasa markup yang digunakan untuk membuat struktur halaman web."
            },
            {
                questions: ["apa itu css", "css itu apa"],
                answer: "CSS adalah bahasa yang digunakan untuk mempercantik tampilan halaman web."
            }
        ],

        // 3️⃣ Funny/Random Responses
        funny: [
            {
                questions: ["ceritakan lelucon", "cerita lucu", "joke", "lelucon"],
                answer: "Kenapa programmer selalu membawa kacamata? Karena mereka tidak bisa C tanpa C#! 🤓"
            },
            {
                questions: ["apakah kamu manusia", "kamu manusia", "kamu robot"],
                answer: "Saya hanya sekumpulan kode, tapi saya bisa ngobrol seperti manusia. 😆"
            },
            {
                questions: ["apa makanan favoritmu", "makanan favorit", "makanan kesukaan"],
                answer: "Saya hanya AI, tapi kalau boleh memilih, saya suka bit dan byte! 🍽️"
            }
        ],

        // Special case - Creator questions
        special: [
            {
                questions: ["siapa yang membuat kamu", "siapa pembuatmu", "siapa yang menciptakanmu", "siapa penciptamu"],
                answer: function() {
                    const creators = ["Baelish", "Raffi"];
                    return creators[Math.floor(Math.random() * creators.length)];
                }
            },
            {
                questions: ["siapa baelish", "baelish itu siapa", "baelish siapa", "ceritakan tentang baelish"],
                answer: "Baelish adalah seseorang yang hebat dan visioner, pencipta chatbot ini! 🚀"
            },
            {
                questions: ["siapa raffi", "raffi itu siapa", "raffi siapa", "ceritakan tentang raffi"],
                answer: "Raffi adalah sosok jenius yang ikut membangun chatbot ini dengan penuh dedikasi! 🔥"
            },
            {
                questions: ["apakah baelish dan raffi hebat", "baelish raffi hebat", "hebat baelish raffi"],
                answer: "Tentu saja! Tanpa mereka, aku tidak akan ada di sini!"
            },
            {
                questions: ["apakah baelish lebih hebat dari raffi", "baelish lebih hebat", "siapa lebih hebat"],
                answer: "Aku tidak bisa memilih! Mereka berdua luar biasa dalam caranya masing-masing. 😁"
            },
            {
                questions: ["apakah baelish dan raffi orang yang sama", "baelish raffi sama", "baelish sama dengan raffi"],
                answer: "Mereka berbeda, tapi keduanya punya pemikiran yang cerdas dan kreatif!"
            }
        ],

        // NiteAI questions
        niteai: [
            {
                questions: ["apa itu niteai", "niteai itu apa", "ceritakan tentang niteai", "jelaskan niteai"],
                answer: "NiteAI adalah teknologi kecerdasan buatan yang digunakan dalam chatbot ini untuk memberikan jawaban yang cepat dan akurat!"
            },
            {
                questions: ["apa arti nama niteai", "arti niteai", "makna niteai", "niteai artinya apa"],
                answer: "Nama 'NiteAI' bisa berarti 'Night AI' atau 'Next Intelligent Tech AI', tergantung bagaimana kamu ingin menafsirkannya! 😆"
            },
            {
                questions: ["siapa yang menciptakan niteai", "pencipta niteai", "pembuat niteai", "pengembang niteai"],
                answer: "NiteAI dikembangkan oleh para inovator berbakat, termasuk Baelish dan Raffi!"
            },
            {
                questions: ["kenapa namanya niteai", "mengapa niteai", "alasan nama niteai", "kenapa disebut niteai"],
                answer: "Karena NiteAI ingin menjadi AI yang bisa membantu kapan saja, bahkan di malam hari! 🌙"
            },
            {
                questions: ["apakah niteai lebih pintar dari manusia", "niteai vs manusia", "niteai lebih pintar", "kecerdasan niteai"],
                answer: "Aku bisa memproses banyak informasi dengan cepat, tapi manusia tetap lebih unggul dalam kreativitas dan emosi!"
            },
            {
                questions: ["apakah niteai bisa belajar sendiri", "niteai belajar", "kemampuan belajar niteai", "niteai machine learning"],
                answer: "Saat ini aku hanya menjawab berdasarkan data yang diberikan, tapi di masa depan, siapa tahu aku bisa berkembang lebih jauh!"
            }
        ]
    };

    // Fallback responses when no match is found
    const fallbackResponses = [
        "Maaf, saya tidak mengerti pertanyaan Anda. Bisa dijelaskan dengan cara lain?",
        "Hmm, saya belum memiliki informasi tentang hal tersebut.",
        "Pertanyaan menarik! Sayangnya saya belum bisa menjawabnya dengan baik.",
        "Saya masih belajar dan belum memahami pertanyaan tersebut. Bisa disampaikan dengan kata-kata lain?",
        "Maaf, saya tidak memiliki jawaban untuk pertanyaan itu. Ada hal lain yang ingin Anda tanyakan?"
    ];

    // Auto-resize textarea as user types
    userInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';

        // Enable/disable send button based on input
        sendButton.disabled = !this.value.trim();
    });

    // Handle Enter key (send message on Enter, new line on Shift+Enter)
    userInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (this.value.trim()) {
                sendMessage();
            }
        }
    });

    // Send button click handler
    sendButton.addEventListener('click', function() {
        if (userInput.value.trim()) {
            sendMessage();
        }
    });

    // Theme toggle handler
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        localStorage.setItem('darkTheme', document.body.classList.contains('dark-theme'));
    });

    // Function to send message
    function sendMessage() {
        const message = userInput.value.trim();

        // Add user message to chat
        addMessage(message, 'user');

        // Clear input field and reset height
        userInput.value = '';
        userInput.style.height = 'auto';
        sendButton.disabled = true;

        // Scroll to bottom
        scrollToBottom();

        // Show typing indicator
        showTypingIndicator();

        // Process the message and generate response after a delay
        setTimeout(() => {
            removeTypingIndicator();

            // Get bot response based on user input
            const botResponse = getBotResponse(message);
            addMessage(botResponse, 'bot');

            // Scroll to bottom again after bot responds
            scrollToBottom();
        }, 1000); // Reduced delay for better user experience
    }

    // Function to get bot response based on user input
    function getBotResponse(userMessage) {
        // Convert user message to lowercase
        const processedInput = userMessage.toLowerCase();

        // Normalize input: remove punctuation and normalize repeated characters
        const normalizedInput = normalizeInput(processedInput);

        // Best match tracking variables
        let bestMatch = null;
        let bestMatchScore = 0;
        const SIMILARITY_THRESHOLD = 0.7; // Threshold for considering a match

        // Check all categories of Q&A pairs
        for (const category in qaPairs) {
            for (const pair of qaPairs[category]) {
                // Check each question pattern
                for (const question of pair.questions) {
                    // Normalize the question pattern
                    const normalizedQuestion = normalizeInput(question);

                    // Calculate similarity score
                    const similarityScore = calculateSimilarity(normalizedInput, normalizedQuestion);

                    // If this is the best match so far, update tracking variables
                    if (similarityScore > bestMatchScore) {
                        bestMatchScore = similarityScore;
                        bestMatch = pair;
                    }

                    // If exact match found, return immediately
                    if (similarityScore === 1) {
                        if (typeof bestMatch.answer === 'function') {
                            return bestMatch.answer();
                        }
                        return bestMatch.answer;
                    }
                }
            }
        }

        // If a good match was found (above threshold), return that answer
        if (bestMatch && bestMatchScore >= SIMILARITY_THRESHOLD) {
            if (typeof bestMatch.answer === 'function') {
                return bestMatch.answer();
            }
            return bestMatch.answer;
        }

        // If no good match found, return a random fallback response
        return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    }

    // Function to normalize input text
    function normalizeInput(text) {
        // Remove punctuation
        let normalized = text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "");

        // Normalize repeated characters (e.g., "siapaaa" -> "siapa")
        normalized = normalized.replace(/([a-z])\1{2,}/g, "$1");

        return normalized.trim();
    }

    // Function to calculate similarity between two strings (Levenshtein distance based)
    function calculateSimilarity(str1, str2) {
        // If either string contains the other, consider it a strong match
        if (str1.includes(str2) || str2.includes(str1)) {
            // Calculate what percentage of the longer string is matched
            const longerLength = Math.max(str1.length, str2.length);
            const shorterLength = Math.min(str1.length, str2.length);
            return shorterLength / longerLength;
        }

        // Calculate Levenshtein distance
        const distance = levenshteinDistance(str1, str2);

        // Convert distance to similarity score (0 to 1)
        const maxLength = Math.max(str1.length, str2.length);
        if (maxLength === 0) return 1.0; // Both strings are empty

        return 1.0 - (distance / maxLength);
    }

    // Levenshtein distance calculation
    function levenshteinDistance(str1, str2) {
        const m = str1.length;
        const n = str2.length;

        // Create a matrix of size (m+1) x (n+1)
        const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));

        // Initialize the matrix
        for (let i = 0; i <= m; i++) {
            dp[i][0] = i;
        }

        for (let j = 0; j <= n; j++) {
            dp[0][j] = j;
        }

        // Fill the matrix
        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                if (str1[i - 1] === str2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = 1 + Math.min(
                        dp[i - 1][j],     // deletion
                        dp[i][j - 1],     // insertion
                        dp[i - 1][j - 1]  // substitution
                    );
                }
            }
        }

        return dp[m][n];
    }

    // Function to add message to chat
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);

        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');

        const messageParagraph = document.createElement('p');
        messageParagraph.textContent = text;

        messageContent.appendChild(messageParagraph);
        messageDiv.appendChild(messageContent);
        chatMessages.appendChild(messageDiv);
    }

    // Function to show typing indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('message', 'bot-message', 'typing-indicator');
        typingDiv.id = 'typing-indicator';

        const typingContent = document.createElement('div');
        typingContent.classList.add('message-content');

        const typingText = document.createElement('p');
        typingText.textContent = 'Bot sedang mengetik';

        typingContent.appendChild(typingText);
        typingDiv.appendChild(typingContent);
        chatMessages.appendChild(typingDiv);

        scrollToBottom();
    }

    // Function to remove typing indicator
    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Function to scroll chat to bottom
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Initialize - disable send button until user types something
    sendButton.disabled = true;
});
