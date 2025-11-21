const fs = require('fs');
const path = require('path');

// Hàm đọc file .env.local thủ công để không phụ thuộc vào library dotenv
function loadEnvConfig() {
  try {
    const envPath = path.resolve(process.cwd(), '.env.local');
    const envFile = fs.readFileSync(envPath, 'utf8');
    const config = {};
    
    envFile.split('\n').forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, ''); // Remove quotes
        config[key] = value;
      }
    });
    return config;
  } catch (error) {
    console.error('❌ Không tìm thấy hoặc không đọc được file .env.local');
    process.exit(1);
  }
}

async function checkKey(keyName, apiKey) {
  try {
    const start = Date.now();
    // Gọi endpoint models vì nó nhẹ và không tốn token, chỉ cần auth đúng
    const response = await fetch('https://api.groq.com/openai/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    const time = Date.now() - start;

    if (response.status === 200) {
      console.log(`✅ ${keyName}: HOẠT ĐỘNG TỐT (${time}ms)`);
      return true;
    } else {
      console.log(`❌ ${keyName}: LỖI (Status: ${response.status})`);
      if (response.status === 401) console.log(`   -> Key không hợp lệ hoặc đã bị revoke.`);
      if (response.status === 429) console.log(`   -> Key đang bị Rate Limit (hết quota).`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${keyName}: LỖI KẾT NỐI (${error.message})`);
    return false;
  }
}

async function main() {
  console.log('🔍 Đang quét các Groq API Keys trong .env.local...\n');
  
  const envConfig = loadEnvConfig();
  const groqKeys = Object.keys(envConfig).filter(key => key.startsWith('GROQ_API_KEY_'));

  if (groqKeys.length === 0) {
    console.log('⚠️ Không tìm thấy key nào bắt đầu bằng GROQ_API_KEY_');
    return;
  }

  console.log(`Tìm thấy ${groqKeys.length} keys. Bắt đầu kiểm tra...\n`);

  let activeCount = 0;
  
  for (const keyName of groqKeys) {
    const isWorking = await checkKey(keyName, envConfig[keyName]);
    if (isWorking) activeCount++;
  }

  console.log('\n-----------------------------------');
  console.log(`📊 KẾT QUẢ: ${activeCount}/${groqKeys.length} keys hoạt động.`);
  console.log('-----------------------------------');
}

main();