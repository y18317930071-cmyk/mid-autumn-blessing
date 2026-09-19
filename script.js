/* ============================================
   中秋AI祝福密码机 - 核心逻辑
   ============================================
   
   【密码规则集中定义区】
   修改这里即可改变密码对应关系！
   孩子们可以在老师指导下添加新图案和新词语。
   ============================================ */

const codeMap = {
    "⭐": "幸福",
    "🌿": "开心",
    "☀️": "安康",
    "🐇": "看月亮",
    "❤️": "团圆"
};

/* ============================================
   以下为程序运行逻辑，一般不需要修改
   ============================================ */

// 当前已选择的图案序列
let selectedEmojis = [];

// 是否正在解密动画中（防止重复点击）
let isDecrypting = false;

// ---------- DOM 元素 ----------
const cipherDisplay = document.getElementById("cipherDisplay");
const processArea = document.getElementById("decryptProcess");
const processTitle = document.getElementById("processTitle");
const processSteps = document.getElementById("processSteps");
const finalResult = document.getElementById("finalResult");
const btnDecrypt = document.getElementById("btnDecrypt");
const btnUndo = document.getElementById("btnUndo");
const btnClear = document.getElementById("btnClear");
const btnToggleRules = document.getElementById("btnToggleRules");
const rulesContent = document.getElementById("rulesContent");

// ---------- 初始化 ----------
function init() {
    // 绑定图案按钮点击事件
    document.querySelectorAll(".emoji-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
            if (isDecrypting) return;
            var emoji = this.getAttribute("data-emoji");
            addEmoji(emoji);
        });
    });

    // 撤回按钮
    btnUndo.addEventListener("click", function () {
        if (isDecrypting) return;
        undoLast();
    });

    // 清空按钮
    btnClear.addEventListener("click", function () {
        if (isDecrypting) return;
        clearAll();
    });

    // 开始解密按钮
    btnDecrypt.addEventListener("click", function () {
        if (isDecrypting) return;
        startDecrypt();
    });

    // 查看规则按钮
    btnToggleRules.addEventListener("click", function () {
        toggleRules();
    });

    // 初始渲染
    renderCipher();
}

// ---------- 添加图案 ----------
function addEmoji(emoji) {
    selectedEmojis.push(emoji);
    renderCipher();
}

// ---------- 撤回最后一个 ----------
function undoLast() {
    if (selectedEmojis.length === 0) return;
    selectedEmojis.pop();
    renderCipher();
    // 同时隐藏解密结果
    hideDecryptResult();
}

// ---------- 清空全部 ----------
function clearAll() {
    selectedEmojis = [];
    renderCipher();
    hideDecryptResult();
}

// ---------- 隐藏解密结果 ----------
function hideDecryptResult() {
    processArea.style.display = "none";
    processSteps.innerHTML = "";
    finalResult.style.display = "none";
    finalResult.textContent = "";
}

// ---------- 渲染密文显示区 ----------
function renderCipher() {
    cipherDisplay.innerHTML = "";

    if (selectedEmojis.length === 0) {
        var placeholder = document.createElement("span");
        placeholder.className = "cipher-placeholder";
        placeholder.textContent = "点击下面的图案，创造一条秘密祝福吧！";
        cipherDisplay.appendChild(placeholder);
        return;
    }

    selectedEmojis.forEach(function (emoji) {
        var span = document.createElement("span");
        span.className = "cipher-item";
        span.textContent = emoji;
        cipherDisplay.appendChild(span);
    });
}

// ---------- 开始解密（动画过程） ----------
function startDecrypt() {
    if (selectedEmojis.length === 0) {
        alert("请先选择至少一个图案哦！");
        return;
    }

    isDecrypting = true;
    btnDecrypt.disabled = true;

    // 显示解密过程区域
    processArea.style.display = "block";
    processSteps.innerHTML = "";
    finalResult.style.display = "none";
    finalResult.textContent = "";
    processTitle.textContent = "正在读取密码……";

    // 按顺序逐个解密
    var index = 0;
    var words = [];

    function decryptNext() {
        if (index >= selectedEmojis.length) {
            // 全部完成
            processTitle.textContent = "🎉 解密成功！";
            var blessing = words.join("") + "！";
            finalResult.textContent = "🎉 " + blessing;
            finalResult.style.display = "block";
            isDecrypting = false;
            btnDecrypt.disabled = false;
            return;
        }

        var emoji = selectedEmojis[index];
        var word = codeMap[emoji] || "???";
        words.push(word);

        // 创建步骤显示
        var stepDiv = document.createElement("div");
        stepDiv.className = "process-step";

        var emojiSpan = document.createElement("span");
        emojiSpan.className = "step-emoji";
        emojiSpan.textContent = emoji;

        var arrowSpan = document.createElement("span");
        arrowSpan.className = "step-arrow";
        arrowSpan.textContent = "→";

        var wordSpan = document.createElement("span");
        wordSpan.className = "step-word";
        wordSpan.textContent = word;

        stepDiv.appendChild(emojiSpan);
        stepDiv.appendChild(arrowSpan);
        stepDiv.appendChild(wordSpan);
        processSteps.appendChild(stepDiv);

        index++;

        // 延迟后处理下一个
        setTimeout(decryptNext, 500);
    }

    // 先延迟一下再开始，让孩子看到"正在读取"
    setTimeout(decryptNext, 600);
}

// ---------- 切换规则显示 ----------
function toggleRules() {
    if (rulesContent.style.display === "none") {
        rulesContent.style.display = "block";
        btnToggleRules.textContent = "🙈 收起程序规则";
    } else {
        rulesContent.style.display = "none";
        btnToggleRules.textContent = "👀 查看我的程序规则";
    }
}

// ---------- 启动 ----------
init();
