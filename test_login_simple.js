// 模拟localStorage
const localStorage = {
    _data: {},
    getItem: function(key) {
        return this._data[key] || null;
    },
    setItem: function(key, value) {
        this._data[key] = value;
        console.log(`localStorage.setItem(${key}, ${value})`);
    },
    removeItem: function(key) {
        delete this._data[key];
        console.log(`localStorage.removeItem(${key})`);
    },
    clear: function() {
        this._data = {};
        console.log('localStorage.clear()');
    }
};

// 模拟window.location
global.window = {
    location: {
        href: 'http://localhost/login.html',
        pathname: '/login.html'
    }
};

// 测试登录成功函数
function testLoginSuccess() {
    console.log('=== 开始测试登录成功流程 ===');
    
    // 模拟用户数据
    const user = {
        id: Date.now(),
        username: 'testuser',
        email: 'test@example.com',
        name: '测试用户',
        avatar: '👤',
        joinDate: new Date().toISOString().split('T')[0],
        level: 1
    };
    
    // 执行loginSuccess函数
    loginSuccess(user, false);
    
    // 验证localStorage
    console.log('\n=== 验证localStorage ===');
    const savedUser = localStorage.getItem('yueyangCurrentUser');
    console.log('保存的用户数据:', savedUser ? JSON.parse(savedUser) : null);
    
    const justLoggedIn = localStorage.getItem('justLoggedIn');
    console.log('justLoggedIn标记:', justLoggedIn);
    
    console.log('\n=== 测试完成 ===');
}

// loginSuccess函数
function loginSuccess(user, rememberMe) {
    console.log('进入loginSuccess函数');
    
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

    console.log('准备保存用户数据:', userData);
    localStorage.setItem('yueyangCurrentUser', JSON.stringify(userData));
    
    // 验证是否保存成功
    const savedUser = localStorage.getItem('yueyangCurrentUser');
    console.log('保存后获取到的用户数据:', savedUser);
    
    // 设置登录来源标记
    localStorage.setItem('justLoggedIn', 'true');
    console.log('设置justLoggedIn标记');
    
    // 模拟跳转到index.html页面
    console.log('准备跳转到index.html');
    window.location.href = 'http://localhost/index.html';
    console.log('新的页面地址:', window.location.href);
}

// 执行测试
testLoginSuccess();