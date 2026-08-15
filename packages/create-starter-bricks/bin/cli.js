#!/usr/bin/env node

import { confirm, input, select } from '@inquirer/prompts';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATE_ENGINES = ['pug', 'nunjucks', 'twig'];
const DEFAULT_PROJECT_NAME = 'my-new-project';

const WINDOWS_RESERVED_NAMES = new Set([
    'con',
    'prn',
    'aux',
    'nul',
    'com1',
    'com2',
    'com3',
    'com4',
    'com5',
    'com6',
    'com7',
    'com8',
    'com9',
    'lpt1',
    'lpt2',
    'lpt3',
    'lpt4',
    'lpt5',
    'lpt6',
    'lpt7',
    'lpt8',
    'lpt9'
]);

const validateProjectName = (value) => {
    const projectName = value.trim();

    if (!projectName) {
        return 'Project name is required.';
    }

    if (projectName === '.' || projectName === '..') {
        return 'Project name cannot be "." or "..".';
    }

    if (projectName.includes('/') || projectName.includes('\\')) {
        return 'Enter a folder name, not a path.';
    }

    if (path.isAbsolute(projectName)) {
        return 'Absolute paths are not allowed.';
    }

    if (projectName !== projectName.toLowerCase()) {
        return 'Project name must use lowercase letters.';
    }

    if (!/^[a-z0-9][a-z0-9._-]*$/.test(projectName)) {
        return [
            'Project name may contain only lowercase letters,',
            'numbers, dots, hyphens and underscores.'
        ].join(' ');
    }

    if (projectName.endsWith('.') || projectName.endsWith('-')) {
        return 'Project name cannot end with a dot or hyphen.';
    }

    if (WINDOWS_RESERVED_NAMES.has(projectName.toLowerCase())) {
        return `"${projectName}" is a reserved system name.`;
    }

    if (projectName.length > 214) {
        return 'Project name must not exceed 214 characters.';
    }

    return true;
};

const ensureTemplateExists = async (templatePath, label) => {
    if (!(await fs.pathExists(templatePath))) {
        throw new Error(`${label} was not found: ${templatePath}`);
    }
};

const ensureDestinationIsAvailable = async (projectPath) => {
    if (!(await fs.pathExists(projectPath))) {
        return;
    }

    const stat = await fs.stat(projectPath);

    if (!stat.isDirectory()) {
        throw new Error(
            `Destination "${projectPath}" exists and is not a directory.`
        );
    }

    const files = await fs.readdir(projectPath);

    if (files.length > 0) {
        throw new Error(
            `Destination directory "${projectPath}" is not empty.`
        );
    }
};

const copyTemplateLayer = async ({
                                     templatesDir,
                                     projectPath,
                                     layerName,
                                     sourceFolder
                                 }) => {
    const sourcePath = path.join(templatesDir, layerName);
    const targetPath = path.join(projectPath, sourceFolder);

    await ensureTemplateExists(
        sourcePath,
        `Template layer "${layerName}"`
    );

    await fs.copy(sourcePath, targetPath, {
        overwrite: true,
        errorOnExist: false
    });
};

const replaceConfigValue = ({
                                content,
                                pattern,
                                replacement,
                                optionName
                            }) => {
    if (!pattern.test(content)) {
        throw new Error(
            `Option "${optionName}" was not found in user.config.js.`
        );
    }

    return content.replace(pattern, replacement);
};

const updateUserConfig = async ({
                                    projectPath,
                                    templateEngine,
                                    typeScript,
                                    emailsBuild
                                }) => {
    const configPath = path.join(projectPath, 'user.config.js');

    await ensureTemplateExists(configPath, 'Configuration file');

    let content = await fs.readFile(configPath, 'utf8');

    content = replaceConfigValue({
        content,
        pattern: /templateEngine:\s*['"`](pug|nunjucks|twig)['"`]/,
        replacement: `templateEngine: '${templateEngine}'`,
        optionName: 'templateEngine'
    });

    content = replaceConfigValue({
        content,
        pattern: /typeScript:\s*(true|false)/,
        replacement: `typeScript: ${typeScript}`,
        optionName: 'typeScript'
    });

    content = replaceConfigValue({
        content,
        pattern: /emailsBuild:\s*(true|false)/,
        replacement: `emailsBuild: ${emailsBuild}`,
        optionName: 'emailsBuild'
    });

    await fs.writeFile(configPath, content, 'utf8');
};

const updatePackageJson = async ({
    projectPath,
    projectName
}) => {
    const packagePath = path.join(projectPath, 'package.json');

    await ensureTemplateExists(packagePath, 'package.json');

    const packageJson = await fs.readJson(packagePath);

    packageJson.name = projectName;
    packageJson.version = '1.0.0';
    packageJson.private = true;

    const exportedFile = packageJson.exports
        ? path.join(projectPath, packageJson.exports)
        : null;

    if (
        exportedFile
        && !(await fs.pathExists(exportedFile))
    ) {
        delete packageJson.exports;
    }

    await fs.writeJson(packagePath, packageJson, {
        spaces: 2,
        EOL: '\n'
    });
};

const updateAgentsMd = async ({
    projectPath,
    projectName
}) => {
    const agentsPath = path.join(projectPath, 'AGENTS.md');

    await ensureTemplateExists(agentsPath, 'AGENTS.md');

    const content = await fs.readFile(agentsPath, 'utf8');
    const titlePattern = /^# AGENTS\.md — Starter Bricks$/m;

    if (!titlePattern.test(content)) {
        throw new Error(
            'Project title was not found in AGENTS.md.'
        );
    }

    await fs.writeFile(
        agentsPath,
        content.replace(
            titlePattern,
            `# AGENTS.md — ${projectName}`
        ),
        'utf8'
    );
};

const askQuestions = async () => {
    const projectName = await input({
        message: 'Project folder name:',
        default: DEFAULT_PROJECT_NAME,
        validate: validateProjectName,
        transformer: (value) => value.trim()
    });

    const templateEngine = await select({
        message: 'Which template engine do you want to use?',
        choices: [
            {
                name: 'Twig',
                value: 'twig',
                description: 'Recommended for Symfony and PHP projects.'
            },
            {
                name: 'Pug',
                value: 'pug',
                description: 'Concise HTML templating syntax.'
            },
            {
                name: 'Nunjucks',
                value: 'nunjucks',
                description: 'Jinja-inspired JavaScript templates.'
            }
        ],
        default: 'twig'
    });

    const typeScript = await confirm({
        message: 'Use TypeScript?',
        default: true
    });

    const emailsBuild = await confirm({
        message: 'Include MJML email templates?',
        default: false
    });

    return {
        projectName: projectName.trim(),
        templateEngine,
        typeScript,
        emailsBuild
    };
};

const createProject = async (answers) => {
    if (!TEMPLATE_ENGINES.includes(answers.templateEngine)) {
        throw new Error(
            `Unsupported template engine: ${answers.templateEngine}`
        );
    }

    const cwd = process.cwd();
    const templatesDir = path.resolve(__dirname, '..', 'templates');
    const projectPath = path.resolve(cwd, answers.projectName);
    const sourceFolder = 'src';

    if (path.dirname(projectPath) !== cwd) {
        throw new Error(
            'Project must be created in the current directory.'
        );
    }

    const baseTemplatePath = path.join(templatesDir, 'base');

    await ensureTemplateExists(baseTemplatePath, 'Base template');
    await ensureDestinationIsAvailable(projectPath);

    console.log(
        chalk.yellow('\n📁 Copying the base structure...')
    );

    await fs.copy(baseTemplatePath, projectPath, {
        overwrite: false,
        errorOnExist: true
    });

    console.log(
        chalk.yellow(
            `📁 Adding template engine: ${answers.templateEngine}`
        )
    );

    await copyTemplateLayer({
        templatesDir,
        projectPath,
        layerName: `template-${answers.templateEngine}`,
        sourceFolder
    });

    const scriptChoice = answers.typeScript ? 'ts' : 'js';

    console.log(
        chalk.yellow(`📁 Adding scripts: ${scriptChoice}`)
    );

    await copyTemplateLayer({
        templatesDir,
        projectPath,
        layerName: `template-${scriptChoice}`,
        sourceFolder
    });

    if (answers.emailsBuild) {
        console.log(
            chalk.yellow('📁 Adding MJML email templates...')
        );

        await copyTemplateLayer({
            templatesDir,
            projectPath,
            layerName: 'template-mjml',
            sourceFolder: path.join('src', 'templates')
        });
    }

    console.log(
        chalk.yellow('⚙️  Applying project settings...')
    );

    await updateUserConfig({
        projectPath,
        templateEngine: answers.templateEngine,
        typeScript: answers.typeScript,
        emailsBuild: answers.emailsBuild
    });

    await updatePackageJson({
        projectPath,
        projectName: answers.projectName
    });

    await updateAgentsMd({
        projectPath,
        projectName: answers.projectName
    });

    return {
        projectPath,
        projectName: answers.projectName
    };
};

const printSuccess = ({ projectPath, projectName }) => {
    console.log(
        chalk.green('\n✅ Project created successfully!')
    );

    console.log(chalk.dim(`   ${projectPath}`));

    console.log(chalk.cyan('\n🚀 Next steps:\n'));
    console.log(`   cd ${projectName}`);
    console.log('   npm install');
    console.log('   npm start\n');
};

const main = async () => {
    console.log(
        chalk.blue.bold('\n🚀 Fe Starter Bricks — Create a project\n')
    );

    const answers = await askQuestions();
    const result = await createProject(answers);

    printSuccess(result);
};

main().catch((error) => {
    if (error?.name === 'ExitPromptError') {
        console.log(chalk.yellow('\n\nOperation cancelled.\n'));
        process.exitCode = 0;
        return;
    }

    console.error(
        chalk.red.bold('\n❌ Failed to create the project.\n')
    );

    console.error(chalk.red(error.message));

    if (process.env.DEBUG) {
        console.error(chalk.dim(error.stack));
    }

    console.log(
        chalk.dim('\nRun with DEBUG=1 to display the full error.\n')
    );

    process.exitCode = 1;
});
