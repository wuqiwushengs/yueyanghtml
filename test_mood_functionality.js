// 模拟DOMContentLoaded事件
function simulateDOMLoaded() {
    // 检查appData是否正确初始化
    console.log('appData.mood:', window.appData.mood);
    console.log('appData.mood.history:', window.appData.mood.history);
    
    // 模拟选择情绪
    simulateSelectMood('happy');
    
    // 模拟添加备注
    simulateAddNote('今天感觉非常开心！');
    
    // 模拟保存情绪
    simulateSaveMood();
    
    // 检查数据是否正确更新
    checkDataUpdate();
}

// 模拟选择情绪
function simulateSelectMood(mood) {
    console.log(`\n模拟选择情绪: ${mood}`);
    selectTodayMood(mood);
    console.log('当前情绪:', currentMood);
    console.log('appData.mood.today:', window.appData.mood.today);
}

// 模拟添加备注
function simulateAddNote(note) {
    console.log(`\n模拟添加备注: ${note}`);
    const noteInput = document.getElementById('moodNote');
    if (noteInput) {
        noteInput.value = note;
        console.log('备注已添加');
    } else {
        console.error('未找到备注输入框');
    }
}

// 模拟保存情绪
function simulateSaveMood() {
    console.log('\n模拟保存情绪');
    saveTodayMood();
}

// 检查数据是否正确更新
function checkDataUpdate() {
    setTimeout(() => {
        console.log('\n检查数据更新:');
        console.log('情绪历史记录数量:', window.appData.mood.history.length);
        console.log('最新的情绪记录:', window.appData.mood.history[0]);
        console.log('总情绪记录数:', window.appData.stats.totalMoodRecords);
        
        // 检查DOM是否更新
        const moodHistory = document.getElementById('moodHistory');
        if (moodHistory && moodHistory.children.length > 0) {
            console.log('情绪历史记录DOM已更新');
        } else {
            console.error('情绪历史记录DOM未更新');
        }
        
        console.log('\n测试完成！');
    }, 1500);
}

// 等待页面加载完成后执行测试
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', simulateDOMLoaded);
} else {
    simulateDOMLoaded();
}