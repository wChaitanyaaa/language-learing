import React, { useState, useEffect } from 'react';
import { Sun, Moon, MessageCircle, Book, Code, Award, User, LogOut, Github, Cpu, Database } from 'lucide-react';

// Simulated backend API
const api = {
  login: async (username, password) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, token: 'fake_token' };
  },
  executeCode: async (code, language) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return `Simulated output for ${language}:\n${code}`;
  },
  getChatbotResponse: async (message) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return `AI: I understood your message: "${message}". How can I assist you further?`;
  },
  getLeaderboard: async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [
      { username: 'coder123', score: 1000 },
      { username: 'devmaster', score: 950 },
      { username: 'pythonista', score: 900 },
      { username: 'webwizard', score: 850 },
      { username: 'algorithmace', score: 800 },
    ];
  },
  saveProgress: async (progress) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    localStorage.setItem('userProgress', JSON.stringify(progress));
    return { success: true };
  },
  getProgress: async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const progress = localStorage.getItem('userProgress');
    return progress ? JSON.parse(progress) : { HTML: 0, CSS: 0, JavaScript: 0, Python: 0, Ruby: 0 };
  },
};

const languages = [
  { name: 'HTML', icon: '🌐', color: 'bg-orange-500' },
  { name: 'CSS', icon: '🎨', color: 'bg-blue-500' },
  { name: 'JavaScript', icon: '🚀', color: 'bg-yellow-500' },
  { name: 'Python', icon: '🐍', color: 'bg-green-500' },
  { name: 'Ruby', icon: '💎', color: 'bg-red-500' },
];

const chapters = {
  HTML: ['Structure', 'Text', 'Links', 'Images', 'Tables', 'Forms'],
  CSS: ['Selectors', 'Box Model', 'Layout', 'Flexbox', 'Grid', 'Animations'],
  JavaScript: ['Variables', 'Functions', 'Objects', 'DOM', 'Events', 'Async'],
  Python: ['Basics', 'Data Structures', 'Functions', 'OOP', 'Modules', 'File I/O'],
  Ruby: ['Basics', 'Classes', 'Modules', 'Blocks', 'Gems', 'Metaprogramming'],
};

const generateQuizQuestion = (language) => {
  const questions = {
    HTML: [
      {
        question: 'What does HTML stand for?',
        options: ['Hyper Text Markup Language', 'High Tech Multi Language', 'Hyper Transfer Markup Language', 'None of the above'],
        correctAnswer: 0
      },
      {
        question: 'Which tag is used to create a hyperlink?',
        options: ['<link>', '<a>', '<href>', '<url>'],
        correctAnswer: 1
      },
    ],
    CSS: [
      {
        question: 'What does CSS stand for?',
        options: ['Counter Strike: Source', 'Cascading Style Sheets', 'Colorful Style Sheets', 'Computer Style Sheets'],
        correctAnswer: 1
      },
      {
        question: 'Which property is used to change the background color?',
        options: ['color', 'bgcolor', 'background-color', 'background'],
        correctAnswer: 2
      },
    ],
    JavaScript: [
      {
        question: 'Which of the following is not a JavaScript data type?',
        options: ['Number', 'String', 'Boolean', 'Float'],
        correctAnswer: 3
      },
      {
        question: 'What will the following code return: Boolean(10 > 9)',
        options: ['true', 'false', 'NaN', 'undefined'],
        correctAnswer: 0
      },
    ],
    Python: [
      {
        question: 'What is the output of print(2 ** 3)?',
        options: ['6', '8', '9', 'Error'],
        correctAnswer: 1
      },
      {
        question: 'Which of the following is used to define a function in Python?',
        options: ['func', 'define', 'def', 'function'],
        correctAnswer: 2
      },
    ],
    Ruby: [
      {
        question: 'What is the Ruby command to output text to the console?',
        options: ['console.log', 'System.out.println', 'print', 'puts'],
        correctAnswer: 3
      },
      {
        question: 'Which of the following is not a valid Ruby variable name?',
        options: ['_variable', '@variable', '$variable', '2variable'],
        correctAnswer: 3
      },
    ],
  };

  return questions[language][Math.floor(Math.random() * questions[language].length)];
};

export default function EnhancedLearningPlatform() {
  const [theme, setTheme] = useState('light');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [currentView, setCurrentView] = useState('home');
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [quizQuestion, setQuizQuestion] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [progress, setProgress] = useState({});
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchProgress = async () => {
      const userProgress = await api.getProgress();
      setProgress(userProgress);
    };
    fetchProgress();
  }, []);

  useEffect(() => {
    if (selectedLanguage && !quizQuestion) {
      setQuizQuestion(generateQuizQuestion(selectedLanguage));
    }
  }, [selectedLanguage, quizQuestion]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const data = await api.getLeaderboard();
      setLeaderboard(data);
    };
    fetchLeaderboard();
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await api.login(username, password);
    if (result.success) {
      setIsLoggedIn(true);
      setCurrentView('home');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentView('home');
  };

  const runCode = async () => {
    const result = await api.executeCode(code, selectedLanguage);
    setOutput(result);
  };

  const handleQuizAnswer = async (answerIndex) => {
    if (answerIndex === quizQuestion.correctAnswer) {
      const newScore = quizScore + 1;
      setQuizScore(newScore);
      const newProgress = {
        ...progress,
        [selectedLanguage]: Math.min(100, (progress[selectedLanguage] || 0) + 10)
      };
      setProgress(newProgress);
      await api.saveProgress(newProgress);
    }
    setQuizQuestion(generateQuizQuestion(selectedLanguage));
  };

  const sendChatMessage = async (e) => {
    e.preventDefault();
    if (chatInput.trim()) {
      const newMessages = [...chatMessages, { text: chatInput, sender: 'user' }];
      setChatMessages(newMessages);
      setChatInput('');
      const response = await api.getChatbotResponse(chatInput);
      setChatMessages([...newMessages, { text: response, sender: 'bot' }]);
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-center">Choose Your Learning Path</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {languages.map((language) => (
                <button
                  key={language.name}
                  onClick={() => {
                    setSelectedLanguage(language.name);
                    setCurrentView('chapters');
                  }}
                  className={`p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow ${language.color} text-white`}
                >
                  <h3 className="text-2xl font-bold mb-4">{language.icon} {language.name}</h3>
                  <p>Master {language.name} programming</p>
                </button>
              ))}
            </div>
          </div>
        );
      case 'chapters':
        return (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-center">{selectedLanguage} Chapters</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {chapters[selectedLanguage].map((chapter) => (
                <button
                  key={chapter}
                  onClick={() => setSelectedChapter(chapter)}
                  className={`p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow ${
                    theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <Book className="mb-2" size={24} />
                  <p>{chapter}</p>
                </button>
              ))}
            </div>
            {selectedChapter && (
              <div className={`mt-8 p-6 rounded-lg shadow-md ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}>
                <h3 className="text-2xl font-bold mb-4">{selectedChapter}</h3>
                <p>Detailed content for {selectedChapter} in {selectedLanguage}.</p>
                <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded">
                  <h4 className="font-bold mb-2">Interactive Exercise:</h4>
                  <p>Try to solve this problem related to {selectedChapter}.</p>
                  {/* Add interactive exercise here */}
                </div>
              </div>
            )}
          </div>
        );
      case 'playground':
        return (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-center">Code Playground</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className={`w-full h-64 p-2 border rounded ${
                    theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
                  }`}
                  placeholder={`Enter your ${selectedLanguage} code here...`}
                />
                <button
                  onClick={runCode}
                  className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Run Code
                </button>
              </div>
              <div>
                <pre className={`w-full h-64 p-2 border rounded overflow-auto ${
                  theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
                }`}>
                  {output}
                </pre>
              </div>
            </div>
          </div>
        );
      case 'quiz':
        return (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-center">Quiz</h2>
            {quizQuestion && (
              <div className={`p-6 rounded-lg shadow-md ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}>
                <h3 className="text-xl font-bold mb-4">{quizQuestion.question}</h3>
                <div className="space-y-2">
                  {quizQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuizAnswer(index)}
                      className={`w-full text-left p-2 rounded ${
                        theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                <p className="mt-4">Score: {quizScore}</p>
              </div>
            )}
          </div>
        );
      case 'login':
        return (
          <div className="max-w-md mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Login</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className={`w-full p-2 border rounded ${
                  theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
                }`}
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className={`w-full p-2 border rounded ${
                  theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
                }`}
              />
              <button
                type="submit"
                className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Login
              </button>
            </form>
          </div>
        );
      case 'progress':
        return (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-center">Your Progress</h2>
            {Object.entries(progress).map(([lang, prog]) => (
              <div key={lang} className={`p-6 rounded-lg shadow-md ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}>
                <h3 className="text-xl font-bold mb-4">{lang} Progress</h3>
                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                    <div style={{ width: `${prog}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
                  </div>
                  <div className="text-right">{prog}% Complete</div>
                </div>
              </div>
            ))}
          </div>
        );
      case 'leaderboard':
        return (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-center">Leaderboard</h2>
            <div className={`p-6 rounded-lg shadow-md ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}>
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left">Rank</th>
                    <th className="text-left">Username</th>
                    <th className="text-left">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((user, index) => (
                    <tr key={user.username} className={index % 2 === 0 ? 'bg-gray-100 dark:bg-gray-700' : ''}>
                      <td>{index + 1}</td>
                      <td>{user.username}</td>
                      <td>{user.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      {/* Header */}
      <header className={`p-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
        <nav className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">CodeMaster</h1>
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <button onClick={() => setCurrentView('home')} className="hover:text-blue-600"><Code size={20} /></button>
                <button onClick={() => setCurrentView('leaderboard')} className="hover:text-blue-600"><Award size={20} /></button>
                <button onClick={() => setCurrentView('playground')} className="hover:text-blue-600"><Cpu size={20} /></button>
                <button onClick={() => setCurrentView('quiz')} className="hover:text-blue-600"><Database size={20} /></button>
                <button onClick={() => setCurrentView('progress')} className="hover:text-blue-600"><User size={20} /></button>
                <button onClick={handleLogout} className="hover:text-blue-600"><LogOut size={20} /></button>
              </>
            ) : (
              <button onClick={() => setCurrentView('login')} className="hover:text-blue-600">Login</button>
            )}
            <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4">
        {renderContent()}
      </main>

      {/* Chatbot */}
      <div className="fixed bottom-4 right-4">
        {isChatbotOpen ? (
          <div className={`w-80 h-96 rounded-lg shadow-lg flex flex-col ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-bold">AI Assistant</h3>
              <button onClick={() => setIsChatbotOpen(false)}>Close</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((message, index) => (
                <div key={index} className={`${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  <span className={`inline-block p-2 rounded-lg ${
                    message.sender === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    {message.text}
                  </span>
                </div>
              ))}
            </div>
            <form onSubmit={sendChatMessage} className="p-4 border-t">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask me anything..."
                className={`w-full p-2 rounded border ${
                  theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
              />
            </form>
          </div>
        ) : (
          <button
            onClick={() => setIsChatbotOpen(true)}
            className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600"
          >
            <MessageCircle size={24} />
          </button>
        )}
      </div>
    </div>
  );
}