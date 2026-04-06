const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const packagesDir = path.join(__dirname, '..', 'packages');
const publicDir = path.join(__dirname, '..', 'public');

// 确保 public 目录存在
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 获取 packages 目录下的所有子文件夹
const packages = fs.readdirSync(packagesDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

console.log('发现 packages:', packages);

// 构建每个 package 并复制到 public 目录
packages.forEach(packageName => {
  console.log(`\n正在构建 ${packageName}...`);

  const packagePath = path.join(packagesDir, packageName);

  try {
    // 进入 package 目录并运行构建
    process.chdir(packagePath);
    execSync('pnpm docs:build', { stdio: 'inherit' });

    // 查找构建输出目录（vitepress 默认是 .vitepress/dist）
    const distPath = path.join(packagePath, '.vitepress', 'dist');

    if (fs.existsSync(distPath)) {
      // 目标目录
      const targetDir = path.join(publicDir, packageName);

      // 如果目标目录已存在，先删除
      if (fs.existsSync(targetDir)) {
        fs.rmSync(targetDir, { recursive: true, force: true });
      }

      // 复制构建产物
      fs.mkdirSync(targetDir, { recursive: true });
      execSync(`cp -r ${distPath}/* ${targetDir}/`, { stdio: 'inherit' });

      console.log(`✅ ${packageName} 构建完成，已复制到 public/${packageName}`);
    } else {
      console.warn(`⚠️  ${packageName} 构建产物未找到: ${distPath}`);
    }
  } catch (error) {
    console.error(`❌ ${packageName} 构建失败:`, error.message);
    process.exit(1);
  }
});

console.log('\n✅ 所有 packages 构建完成！');
