// 悦养APP Web应用主要JavaScript文件

// 全局变量
let appData = {
    user: {
        name: '养生达人',
        level: 1,
        joinDate: new Date().toISOString().split('T')[0]
    },
    plant: {
        level: 1,
        progress: 0,
        emoji: '🌱',
        lastWatered: null,
        lastFertilized: null
    },
    tasks: {
        completed: [],
        todayCount: 0,
        streak: 0
    },
    mood: {
        today: null,
        history: [],
        currentEmoji: '😊'
    },
    achievements: [],
    stats: {
        totalTasks: 0,
        totalMoodRecords: 0,
        bestStreak: 0
    }
};

// 初始化应用
document.addEventListener('DOMContentLoaded', function() {
    loadAppData();
    initializeApp();
    updateUI();
    generateRecommendations();
});

// 加载应用数据
function loadAppData() {
    const savedData = localStorage.getItem('yueyangAppData');
    if (savedData) {
        appData = { ...appData, ...JSON.parse(savedData) };
    }
}

// 保存应用数据
function saveAppData() {
    localStorage.setItem('yueyangAppData', JSON.stringify(appData));
}

// 初始化应用
function initializeApp() {
    // 设置当前日期
    const currentDate = new Date().toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const currentDateElement = document.getElementById('currentDate');
    if (currentDateElement) {
        currentDateElement.textContent = currentDate;
    }

    // 设置用户问候
    const userGreeting = document.getElementById('userGreeting');
    if (userGreeting) {
        userGreeting.textContent = `你好，${appData.user.name}！`;
    }

    // 初始化聊天
    initializeChat();

    // 添加页面动画
    addPageAnimations();
}

// 更新UI
function updateUI() {
    updateTodayOverview();
    updatePlantDisplay();
    updateAchievements();
}

// 更新今日概览
function updateTodayOverview() {
    const todayTasksElement = document.getElementById('todayTasks');
    const todayMoodElement = document.getElementById('todayMood');
    const streakDaysElement = document.getElementById('streakDays');

    if (todayTasksElement) {
        todayTasksElement.textContent = appData.tasks.todayCount;
    }
    if (todayMoodElement) {
        todayMoodElement.textContent = appData.mood.currentEmoji;
    }
    if (streakDaysElement) {
        streakDaysElement.textContent = appData.tasks.streak;
    }
}

// 更新植物显示
function updatePlantDisplay() {
    const plantEmojiElement = document.getElementById('plantEmoji');
    const plantProgressElement = document.getElementById('plantProgress');
    const plantStatusElement = document.getElementById('plantStatus');
    const progressCircleElement = document.getElementById('progressCircle');

    if (plantEmojiElement) {
        plantEmojiElement.textContent = appData.plant.emoji;
    }
    if (plantProgressElement) {
        plantProgressElement.textContent = appData.plant.progress;
    }
    if (plantStatusElement) {
        const statusMessages = [
            '需要你的关爱',
            '正在努力成长',
            '状态不错哦',
            '成长得很好',
            '非常健康',
            '茁壮成长',
            '生机勃勃',
            '充满活力',
            '快要成熟了',
            '即将绽放',
            '完美成长'
        ];
        plantStatusElement.textContent = statusMessages[appData.plant.progress] || '状态极佳';
    }
    if (progressCircleElement) {
        const progress = (appData.plant.progress / 10) * 377;
        progressCircleElement.style.strokeDashoffset = 377 - progress;
    }
}

// 更新成就
function updateAchievements() {
    const achievementsElement = document.getElementById('achievements');
    if (achievementsElement) {
        achievementsElement.innerHTML = '';
        appData.achievements.forEach(achievement => {
            const badge = document.createElement('span');
            badge.className = 'achievement-badge';
            badge.textContent = achievement;
            achievementsElement.appendChild(badge);
        });
    }
}

// 浇水功能
function waterPlant() {
    if (appData.plant.progress < 10) {
        appData.plant.progress += 0.5;
        appData.plant.lastWatered = new Date().toISOString();
        
        // 检查是否需要升级植物
        checkPlantUpgrade();
        
        // 添加动画效果
        const plantContainer = document.querySelector('.plant-container');
        if (plantContainer) {
            anime({
                targets: plantContainer,
                scale: [1, 1.1, 1],
                duration: 600,
                easing: 'easeOutElastic(1, .8)'
            });
        }
        
        showToast('💧 浇水成功！植物很开心～', 'success');
        updatePlantDisplay();
        saveAppData();
    } else {
        showToast('植物已经成长到最大等级了！', 'info');
    }
}

// 施肥功能
function fertilizePlant() {
    if (appData.plant.progress < 10) {
        appData.plant.progress += 1;
        appData.plant.lastFertilized = new Date().toISOString();
        
        // 检查是否需要升级植物
        checkPlantUpgrade();
        
        // 添加动画效果
        const plantContainer = document.querySelector('.plant-container');
        if (plantContainer) {
            anime({
                targets: plantContainer,
                scale: [1, 1.15, 1],
                rotate: [0, 5, -5, 0],
                duration: 800,
                easing: 'easeOutElastic(1, .8)'
            });
        }
        
        showToast('🌿 施肥成功！植物成长加速～', 'success');
        updatePlantDisplay();
        saveAppData();
    } else {
        showToast('植物已经成长到最大等级了！', 'info');
    }
}

// 检查植物升级
function checkPlantUpgrade() {
    const plants = [
        { progress: 0, emoji: '🌱', name: '幼苗' },
        { progress: 2, emoji: '🌿', name: '小苗' },
        { progress: 4, emoji: '🪴', name: '盆栽' },
        { progress: 6, emoji: '🌳', name: '小树' },
        { progress: 8, emoji: '🌲', name: '大树' },
        { progress: 10, emoji: '🌸', name: '开花' }
    ];

    const currentPlant = plants.find((plant, index) => {
        const nextPlant = plants[index + 1];
        return appData.plant.progress >= plant.progress && 
               (!nextPlant || appData.plant.progress < nextPlant.progress);
    });

    if (currentPlant && currentPlant.emoji !== appData.plant.emoji) {
        appData.plant.emoji = currentPlant.emoji;
        showToast(`🎉 植物升级了！变成了${currentPlant.name}`, 'success');
        
        // 添加成就
        if (!appData.achievements.includes(`${currentPlant.name}养成`)) {
            appData.achievements.push(`${currentPlant.name}养成`);
        }
    }
}

// 打开任务模态框
function openTaskModal() {
    showModal('taskModal');
}

// 打开情绪模态框
function openMoodModal() {
    showModal('moodModal');
}

// 选择场景
function selectScenario(scenario) {
    // 更新按钮状态
    document.querySelectorAll('.scenario-btn').forEach(btn => {
        btn.classList.remove('bg-green-100', 'border-green-500');
        btn.classList.add('bg-gray-100');
    });
    event.target.classList.remove('bg-gray-100');
    event.target.classList.add('bg-green-100');

    // 显示任务列表
    const taskList = document.getElementById('taskList');
    const tasks = {
        commute: [
            { id: 1, title: '颈部拉伸运动', duration: '3分钟', desc: '轻轻转动颈部，缓解久坐疲劳' },
            { id: 2, title: '眼部放松练习', duration: '2分钟', desc: '远眺窗外，放松眼部肌肉' },
            { id: 3, title: '深呼吸调节', duration: '5分钟', desc: '4-7-8呼吸法，缓解压力' }
        ],
        work: [
            { id: 4, title: '手腕保健操', duration: '2分钟', desc: '活动手腕，预防鼠标手' },
            { id: 5, title: '肩部放松运动', duration: '3分钟', desc: '缓解肩部紧张，改善姿势' },
            { id: 6, title: '站立伸展', duration: '5分钟', desc: '站起来活动，促进血液循环' }
        ],
        sleep: [
            { id: 7, title: '助眠呼吸法', duration: '5分钟', desc: '深度放松，帮助入睡' },
            { id: 8, title: '冥想放松', duration: '10分钟', desc: '清空思绪，平静心灵' },
            { id: 9, title: '轻柔拉伸', duration: '5分钟', desc: '放松肌肉，改善睡眠质量' }
        ]
    };

    taskList.innerHTML = '';
    tasks[scenario].forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = 'task-item';
        taskElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <h4 class="font-semibold text-gray-900">${task.title}</h4>
                    <p class="text-sm text-gray-600">${task.desc}</p>
                    <span class="text-xs text-green-600">⏱️ ${task.duration}</span>
                </div>
                <button onclick="startTask(${task.id}, '${task.title}')" class="bg-green-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-600 transition-colors">
                    开始
                </button>
            </div>
        `;
        taskList.appendChild(taskElement);
    });

    taskList.style.display = 'block';
    
    // 动画效果
    anime({
        targets: taskList,
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 500,
        easing: 'easeOutQuad'
    });
}

// 开始任务
function startTask(taskId, taskTitle) {
    // 模拟任务完成
    setTimeout(() => {
        appData.tasks.todayCount++;
        appData.tasks.completed.push({
            id: taskId,
            title: taskTitle,
            completedAt: new Date().toISOString()
        });
        appData.stats.totalTasks++;
        
        // 更新连续天数
        updateStreak();
        
        // 植物成长
        waterPlant();
        
        showToast(`🎉 任务"${taskTitle}"完成！获得成长值+1`, 'success');
        
        updateUI();
        saveAppData();
        closeModal('taskModal');
    }, 1000);
    
    showToast('正在执行任务...', 'info');
}

// 更新连续天数
function updateStreak() {
    const today = new Date().toDateString();
    const lastTaskDate = appData.tasks.completed.length > 0 ? 
        new Date(appData.tasks.completed[appData.tasks.completed.length - 1].completedAt).toDateString() : 
        null;
    
    if (lastTaskDate === today) {
        appData.tasks.streak = Math.max(appData.tasks.streak, 1);
    } else {
        appData.tasks.streak++;
    }
    
    if (appData.tasks.streak > appData.stats.bestStreak) {
        appData.stats.bestStreak = appData.tasks.streak;
    }
}

// 选择情绪
function selectMood(mood) {
    // 更新选择状态
    document.querySelectorAll('.mood-item').forEach(item => {
        item.classList.remove('selected');
    });
    event.target.closest('.mood-item').classList.add('selected');
    
    appData.mood.today = mood;
    
    const moodEmojis = {
        happy: '😊',
        tired: '😴',
        stressed: '😰',
        anxious: '😟'
    };
    
    appData.mood.currentEmoji = moodEmojis[mood];
    updateUI();
}

// 保存情绪
function saveMood() {
    const note = document.getElementById('moodNote').value.trim();
    
    if (!appData.mood.today) {
        showToast('请先选择你的情绪状态', 'error');
        return;
    }
    
    const moodRecord = {
        mood: appData.mood.today,
        note: note,
        timestamp: new Date().toISOString()
    };
    
    appData.mood.history.push(moodRecord);
    appData.stats.totalMoodRecords++;
    
    showToast('情绪记录保存成功！', 'success');
    closeModal('moodModal');
    updateUI();
    saveAppData();
    
    // AI回复
    setTimeout(() => {
        const aiResponse = generateMoodResponse(appData.mood.today, note);
        addChatMessage(aiResponse, 'ai');
    }, 1000);
}

// 生成情绪响应
function generateMoodResponse(mood, note) {
    const responses = {
        happy: [
            '太棒了！保持这种好心情，今天一定会很顺利的！',
            '开心的心情是最好的养生良药，记得多分享快乐哦～',
            '看到你这么开心，我也很开心呢！继续保持这种积极的状态吧！'
        ],
        tired: [
            '疲惫的时候要注意休息哦，身体是最重要的！',
            '工作再忙也要照顾好自己，建议小憩15分钟恢复精力。',
            '疲劳是身体在提醒你需要休息，听听舒缓的音乐怎么样？'
        ],
        stressed: [
            '压力大的时候更要学会放松，试试5分钟的冥想吧～',
            '我理解你的压力，记得要给自己一些喘息的空间哦。',
            '压力是暂时的，相信你一定能够很好地处理！'
        ],
        anxious: [
            '焦虑的时候试试写下来，把担忧都写在纸上会好很多。',
            '深呼吸，一切都会好起来的。你很棒，要相信自己！',
            '焦虑是暂时的，做一些喜欢的事情转移注意力吧～'
        ]
    };
    
    const moodResponses = responses[mood] || responses.happy;
    return moodResponses[Math.floor(Math.random() * moodResponses.length)];
}

// 初始化聊天
function initializeChat() {
    const chatContainer = document.getElementById('chatContainer');
    if (chatContainer) {
        // 添加欢迎消息
        const welcomeMessages = [
            '今天也要好好照顾自己哦～',
            '有什么烦恼都可以告诉我，我会认真听的！',
            '养生不仅仅是身体的调理，更是心灵的呵护。',
            '每一个小小的改变，都是向健康生活迈进的一步。'
        ];
        
        const randomMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
        addChatMessage(randomMessage, 'ai');
    }
}

// 发送聊天消息
function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    addChatMessage(message, 'user');
    input.value = '';
    
    // AI回复
    setTimeout(() => {
        const aiResponse = generateChatResponse(message);
        addChatMessage(aiResponse, 'ai');
    }, 1000 + Math.random() * 1000);
}

// 添加聊天消息
function addChatMessage(message, type) {
    const chatContainer = document.getElementById('chatContainer');
    if (!chatContainer) return;
    
    const messageElement = document.createElement('div');
    messageElement.className = `chat-bubble ${type}`;
    messageElement.textContent = message;
    
    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    
    // 动画效果
    anime({
        targets: messageElement,
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 500,
        easing: 'easeOutQuad'
    });
}

// 生成聊天响应
function generateChatResponse(message) {
    const keywords = {
        '累': ['累了就要好好休息哦，身体是最重要的！', '疲惫的时候试试深呼吸，或者听些轻音乐～'],
        '烦': ['我理解你的烦恼，说出来会好受一些。', '每个人都会有烦恼的时候，重要的是要学会调节。'],
        '压力': ['压力大的时候更要学会放松，试试冥想吧～', '我理解你的压力，记得要给自己一些喘息的空间哦。'],
        '开心': ['看到你开心我也很开心呢！', '保持好心情，今天一定会很顺利的！'],
        '谢谢': ['不客气，这是我应该做的！', '能帮到你我也很开心～'],
        '你好': ['你好呀！今天感觉怎么样？', '嗨！很高兴和你聊天～']
    };
    
    for (const [keyword, responses] of Object.entries(keywords)) {
        if (message.includes(keyword)) {
            return responses[Math.floor(Math.random() * responses.length)];
        }
    }
    
    const defaultResponses = [
        '我明白了，继续说下去吧～',
        '听起来很有意思，能详细说说吗？',
        '我理解你的感受，想聊聊更多吗？',
        '每个人都有这样的时刻，我们一起面对～',
        '你说得对，这确实很重要。'
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

// 生成推荐内容
function generateRecommendations() {
    const recommendationsElement = document.getElementById('recommendations');
    if (!recommendationsElement) return;
    
    const recommendations = [
        {
            icon: '🎵',
            title: '舒缓音乐推荐',
            desc: '听听轻音乐，放松身心',
            action: '播放音乐'
        },
        {
            icon: '🧘',
            title: '5分钟冥想',
            desc: '简单冥想，缓解压力',
            action: '开始冥想'
        },
        {
            icon: '📖',
            title: '养生小知识',
            desc: '学习实用的养生技巧',
            action: '查看文章'
        },
        {
            icon: '💡',
            title: '今日提醒',
            desc: '记得多喝水，适当运动',
            action: '设置提醒'
        }
    ];
    
    recommendationsElement.innerHTML = '';
    recommendations.forEach(rec => {
        const recElement = document.createElement('div');
        recElement.className = 'flex items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer';
        recElement.innerHTML = `
            <div class="flex items-center space-x-3">
                <div class="text-2xl">${rec.icon}</div>
                <div>
                    <h4 class="font-semibold text-gray-900">${rec.title}</h4>
                    <p class="text-sm text-gray-600">${rec.desc}</p>
                </div>
            </div>
            <button class="text-green-600 text-sm font-medium hover:text-green-700">
                ${rec.action}
            </button>
        `;
        recommendationsElement.appendChild(recElement);
    });
}

// 显示模态框
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // 模态框动画
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            anime({
                targets: modalContent,
                scale: [0.8, 1],
                opacity: [0, 1],
                duration: 300,
                easing: 'easeOutBack'
            });
        }
    }
}

// 关闭模态框
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            anime({
                targets: modalContent,
                scale: [1, 0.8],
                opacity: [1, 0],
                duration: 200,
                easing: 'easeInQuad',
                complete: () => {
                    modal.classList.remove('show');
                    document.body.style.overflow = 'auto';
                }
            });
        } else {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    }
}

// 显示快速操作
function showQuickActions() {
    const actions = [
        { name: '记录情绪', action: () => openMoodModal() },
        { name: '开始任务', action: () => openTaskModal() },
        { name: '查看数据', action: () => showToast('数据查看功能开发中...', 'info') }
    ];
    
    const actionMenu = document.createElement('div');
    actionMenu.className = 'fixed bottom-32 right-4 bg-white rounded-lg shadow-lg p-2 z-50';
    actionMenu.innerHTML = actions.map(action => 
        `<button onclick="this.parentElement.remove(); ${action.action.toString().replace('() => ', '')}" class="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded transition-colors">${action.name}</button>`
    ).join('');
    
    document.body.appendChild(actionMenu);
    
    // 3秒后自动消失
    setTimeout(() => {
        if (actionMenu.parentElement) {
            actionMenu.remove();
        }
    }, 3000);
}

// 添加页面动画
function addPageAnimations() {
    // 卡片入场动画
    anime({
        targets: '.feature-card',
        translateY: [30, 0],
        opacity: [0, 1],
        duration: 800,
        delay: anime.stagger(100),
        easing: 'easeOutQuad'
    });

    // 统计数字动画
    anime({
        targets: '#todayTasks',
        innerHTML: [0, appData.tasks.todayCount],
        duration: 1000,
        easing: 'easeOutQuad',
        round: 1
    });

    anime({
        targets: '#streakDays',
        innerHTML: [0, appData.tasks.streak],
        duration: 1000,
        easing: 'easeOutQuad',
        round: 1,
        delay: 200
    });
}

// 显示Toast提示
function showToast(message, type = 'info') {
    // 移除已存在的toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // 创建toast元素
    const toast = document.createElement('div');
    toast.className = `toast fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm text-white ${
        type === 'error' ? 'bg-red-500' : 
        type === 'success' ? 'bg-green-500' : 
        'bg-blue-500'
    }`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // 动画显示
    anime({
        targets: toast,
        translateX: [300, 0],
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutQuad'
    });
    
    // 3秒后自动消失
    setTimeout(() => {
        anime({
            targets: toast,
            translateX: [0, 300],
            opacity: [1, 0],
            duration: 300,
            easing: 'easeInQuad',
            complete: () => {
                if (toast.parentElement) {
                    toast.remove();
                }
            }
        });
    }, 3000);
}

// 回车键发送消息
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        const chatInput = document.getElementById('chatInput');
        if (document.activeElement === chatInput) {
            sendChatMessage();
        }
    }
    
    // ESC键关闭模态框
    if (e.key === 'Escape') {
        const openModal = document.querySelector('.modal.show');
        if (openModal) {
            closeModal(openModal.id);
        }
    }
});

// 底部导航高亮
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href === currentPage) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
});