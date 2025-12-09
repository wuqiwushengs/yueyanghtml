// 背景动画效果 - 移动的小球球和鼠标交互
class BackgroundAnimation {
    constructor(container) {
        this.container = container;
        this.particles = [];
        this.mousePos = { x: 0, y: 0 };
        this.particleCount = 20; // 减少粒子数量以提高性能
        this.init();
    }

    init() {
        // 创建粒子
        for (let i = 0; i < this.particleCount; i++) {
            this.createParticle();
        }

        // 监听鼠标移动
        document.addEventListener('mousemove', (e) => {
            this.mousePos.x = e.clientX;
            this.mousePos.y = e.clientY;
        });

        // 开始动画循环
        this.animate();
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'background-particle';
        
        // 随机大小
        const size = Math.random() * 15 + 5;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // 随机位置
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.top = `${Math.random() * 100}vh`;
        
        // 随机颜色
        const hue = Math.random() * 120 + 100; // 绿色到青色范围
        const opacity = Math.random() * 0.5 + 0.2;
        particle.style.backgroundColor = `hsla(${hue}, 70%, 60%, ${opacity})`;
        
        // 随机初始速度
        const speedX = (Math.random() - 0.5) * 0.5;
        const speedY = (Math.random() - 0.5) * 0.5;
        
        // 存储粒子的速度信息
        particle.dataset.speedX = speedX;
        particle.dataset.speedY = speedY;
        
        this.container.appendChild(particle);
        this.particles.push(particle);
    }

    animate() {
        this.particles.forEach(particle => {
            // 获取当前位置
            let x = parseFloat(particle.style.left);
            let y = parseFloat(particle.style.top);
            
            // 获取速度
            let speedX = parseFloat(particle.dataset.speedX);
            let speedY = parseFloat(particle.dataset.speedY);
            
            // 更新位置
            x += speedX;
            y += speedY;
            
            // 边界检查
            if (x < 0 || x > 100) speedX *= -1;
            if (y < 0 || y > 100) speedY *= -1;
            
            // 鼠标交互
            const particlePos = particle.getBoundingClientRect();
            const dx = this.mousePos.x - (particlePos.left + particlePos.width / 2);
            const dy = this.mousePos.y - (particlePos.top + particlePos.height / 2);
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // 如果鼠标接近粒子，粒子会远离鼠标
            if (distance < 100) {
                const force = (100 - distance) / 100;
                const angle = Math.atan2(dy, dx);
                
                x -= Math.cos(angle) * force * 2;
                y -= Math.sin(angle) * force * 2;
            }
            
            // 更新粒子位置和速度
            particle.style.left = `${x}vw`;
            particle.style.top = `${y}vh`;
            particle.dataset.speedX = speedX;
            particle.dataset.speedY = speedY;
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// 任务栏小球映射功能
class CardParticleMapper {
    constructor(backgroundAnimation) {
        this.backgroundAnimation = backgroundAnimation;
        this.cardContainers = [];
        this.init();
    }
    
    init() {
        // 为每个任务栏创建小球容器
        this.createCardContainers();
        
        // 开始映射动画
        this.animate();
    }
    
    createCardContainers() {
        const allCards = document.querySelectorAll('.feature-card, .task-card, .mood-card, .profile-card');
        allCards.forEach((card, index) => {
            const particleContainer = document.createElement('div');
            particleContainer.className = 'card-particles-container';
            card.appendChild(particleContainer);
            
            this.cardContainers.push({
                card: card,
                container: particleContainer,
                particles: []
            });
        });
    }
    
    animate() {
        this.cardContainers.forEach(container => {
            // 确保每个任务栏容器中的小球数量与背景小球相同
            this.syncParticleCount(container);
            
            // 更新每个小球的位置和样式
            this.updateParticles(container);
        });
        
        requestAnimationFrame(() => this.animate());
    }
    
    syncParticleCount(container) {
        const backgroundParticles = this.backgroundAnimation.particles;
        const cardParticles = container.particles;
        const cardContainer = container.container;
        
        // 如果背景小球数量多于任务栏小球，创建新的小球
        while (cardParticles.length < backgroundParticles.length) {
            const particle = document.createElement('div');
            particle.className = 'card-particle';
            cardContainer.appendChild(particle);
            cardParticles.push(particle);
        }
        
        // 如果任务栏小球数量多于背景小球，移除多余的小球
        while (cardParticles.length > backgroundParticles.length) {
            const particle = cardParticles.pop();
            particle.remove();
        }
    }
    
    updateParticles(container) {
        const backgroundParticles = this.backgroundAnimation.particles;
        const cardParticles = container.particles;
        const card = container.card;
        
        // 获取任务栏的位置和尺寸
        const cardRect = card.getBoundingClientRect();
        const cardWidth = cardRect.width;
        const cardHeight = cardRect.height;
        
        // 获取视口尺寸
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // 更新每个小球的位置和样式
        cardParticles.forEach((particle, index) => {
            const bgParticle = backgroundParticles[index];
            if (!bgParticle) return;
            
            // 获取背景小球的位置和样式
            const bgParticleRect = bgParticle.getBoundingClientRect();
            const bgSize = bgParticleRect.width;
            const bgColor = bgParticle.style.backgroundColor;
            
            // 将背景小球的视口坐标映射到任务栏的局部坐标
            // 背景小球在视口中的百分比位置
            const bgPercentX = (bgParticleRect.left + bgParticleRect.width / 2) / viewportWidth;
            const bgPercentY = (bgParticleRect.top + bgParticleRect.height / 2) / viewportHeight;
            
            // 转换为任务栏内的像素位置
            const cardX = bgPercentX * cardWidth - bgSize / 2;
            const cardY = bgPercentY * cardHeight - bgSize / 2;
            
            // 设置小球的样式和位置
            particle.style.width = `${bgSize}px`;
            particle.style.height = `${bgSize}px`;
            particle.style.backgroundColor = bgColor;
            particle.style.left = `${cardX}px`;
            particle.style.top = `${cardY}px`;
        });
    }
}

// 初始化背景动画
function initBackgroundAnimation() {
    // 创建背景容器
    const backgroundContainer = document.createElement('div');
    backgroundContainer.className = 'background-animation-container';
    document.body.appendChild(backgroundContainer);
    
    // 初始化动画
    const backgroundAnimation = new BackgroundAnimation(backgroundContainer);
    
    // 初始化任务栏小球映射
    new CardParticleMapper(backgroundAnimation);
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBackgroundAnimation);
} else {
    initBackgroundAnimation();
}