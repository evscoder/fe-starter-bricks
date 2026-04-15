#!/usr/bin/env node

import { confirm, input, select } from '@inquirer/prompts';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const copyTemplateLayer = async ({ templatesDir, projectPath, layerName, sourceFolder }) => {
    const sourcePath = path.join(templatesDir, layerName);
    const targetPath = path.join(projectPath, sourceFolder);

    await fs.copy(sourcePath, targetPath, { overwrite: true });
};

(async () => {
    console.log(chalk.blue('🚀 Fe Starter Bricks — Create a project'));

    const answers = {
        projectName: await input({
            message: 'Project folder name:',
            default: 'my-new-project'
        }),
        templateEngine: await select({
            message: 'Which template engine do you want to use?',
            choices: [
                { name: 'Pug', value: 'pug' },
                { name: 'Nunjucks', value: 'nunjucks' },
                { name: 'Twig', value: 'twig' }
            ]
        }),
        typeScript: await confirm({
            message: 'Use TypeScript?',
            default: true
        }),
        emailsBuild: await confirm({
            message: 'Build MJML emails?',
            default: false
        })
    };

    const projectPath = path.join(process.cwd(), answers.projectName);
    const templatesDir = path.join(__dirname, '..', 'templates');
    const sourceFolder = 'src';

    console.log(chalk.yellow('📁 Copying the base structure...'));
    await fs.copy(path.join(templatesDir, 'base'), projectPath);

    console.log(chalk.yellow(`📁 Adding template engine: ${answers.templateEngine}`));
    await copyTemplateLayer(
        {
            templatesDir,
            projectPath,
            layerName: `template-${answers.templateEngine}`,
            sourceFolder
        }
    );

    const scriptChoice = answers.typeScript ? 'ts' : 'js';
    console.log(chalk.yellow(`📁 Adding scripts: ${scriptChoice}`));
    await copyTemplateLayer(
        {
            templatesDir,
            projectPath,
            layerName: `template-${scriptChoice}`,
            sourceFolder
        }
    );

    console.log(chalk.yellow('⚙️  Applying settings in user.config.js...'));
    const configPath = path.join(projectPath, 'user.config.js');
    let configContent = await fs.readFile(configPath, 'utf-8');

    configContent = configContent.replace(
        /templateEngine: ['"`](pug|nunjucks|twig)['"`]/,
        `templateEngine: '${answers.templateEngine}'`
    );

    configContent = configContent.replace(
        /typeScript: (true|false)/,
        `typeScript: ${answers.typeScript}`
    );

    configContent = configContent.replace(
        /emailsBuild: (true|false)/,
        `emailsBuild: ${answers.emailsBuild}`
    );

    await fs.writeFile(configPath, configContent);

    const packagePath = path.join(projectPath, 'package.json');
    const packageJson = await fs.readJson(packagePath);
    packageJson.name = answers.projectName;
    packageJson.version = '1.0.0';
    await fs.writeJson(packagePath, packageJson, { spaces: 2 });

    console.log(chalk.green('\n✅ Project created successfully!'));
    console.log(chalk.cyan(`\n🚀 Next steps:`));
    console.log(`   cd ${answers.projectName}`);
    console.log(`   npm install`);
    console.log(`   npm start\n`);

})();
