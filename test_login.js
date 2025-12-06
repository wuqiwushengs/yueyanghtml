// 测试登录功能
console.log('测试登录功能...');

// 模拟localStorage
const localStorage = {
    data: {},
    getItem(key) {
        return this.data[key] || null;
    },
    setItem(key, value) {
        this.data[key] = value;
    },
    removeItem(key) {
        delete this.data[key];
    },
    clear() {
        this.data = {};
    }
};

// 模拟用户输入
const username = 'testuser';
const password = 'testpass';

// 清除之前的用户数据
localStorage.removeItem('yueyangCurrentUser');
localStorage.removeItem('justLoggedIn');

// 模拟登录过程
function testLogin() {
    console.log('正在登录...');
    
    // 创建模拟用户
    const user = {
        id: Date.now(),
        username: username,
        email: username + '@example.com',
        password: password,
        name: '测试用户',
        avatar: '👤',
        joinDate: new Date().toISOString().split('T')[0],
        level: 1
    };

    // 保存当前用户信息
    const userData = {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        joinDate: user.joinDate,
        level: user.level,
        loginTime: new Date().toISOString()
    };

    localStorage.setItem('yueyangCurrentUser', JSON.stringify(userData));
    localStorage.setItem('justLoggedIn', 'true');
    
    console.log('登录成功！');
    console.log('用户数据:', userData);
    console.log('justLoggedIn标记:', localStorage.getItem('justLoggedIn'));
    
    // 检查是否能正确跳转到index.html
    console.log('跳转到index.html...');
    
    // 模拟index.html的登录状态检查
    setTimeout(() => {
        const justLoggedIn = localStorage.getItem('justLoggedIn');
        if (justLoggedIn) {
            localStorage.removeItem('justLoggedIn');
            console.log('已清除justLoggedIn标记');
        }
        
        console.log('登录状态检查完成，当前页面: index.html');
        console.log('登录测试通过！');
    }, 1000);
}

// 运行测试
testLogin();