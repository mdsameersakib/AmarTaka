#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const roleNameRaw = process.argv[2];
const roleName = roleNameRaw ? roleNameRaw.toLowerCase() : undefined;
const deleteFlag = process.argv.includes('--delete');
const dryRun = process.argv.includes('--dry-run');

if (!roleName) {
  console.error('Usage: pnpm generate:role <RoleName> [--delete] [--dry-run]');
  process.exit(1);
}

const rolesFile = path.join('src', 'types', 'roles.ts');

function confirm(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y');
    });
  });
}

function toPascalCase(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

async function main() {
  let rolesContent = fs.readFileSync(rolesFile, 'utf8');
  const unionRegex = /export type AppRole = ([^;]+);/;
  const arrayRegex = /export const APP_ROLES: AppRole\[] = \[([^\]]*)\];/;

  if (deleteFlag) {
    if (!dryRun) {
      const ok = await confirm(`Are you sure you want to delete role "${roleName}"? This cannot be undone. (y/N): `);
      if (!ok) return console.log('Aborted.');
    }
    // Remove from union
    rolesContent = rolesContent.replace(new RegExp(`\|\s*['\"]${roleName}['\"]\s*`, 'g'), '');
    // Remove from array
    rolesContent = rolesContent.replace(new RegExp(`['\"]${roleName}['\"],?\s*`, 'g'), '');

    // Clean up trailing or leading | and , in union and array
    // Clean up union
    rolesContent = rolesContent.replace(/export type AppRole =([^;]+);/, (match, p1) => {
      let cleaned = p1.replace(/\|\s*;/g, ';') // trailing |
        .replace(/\|\s*\|/g, '|') // double pipes
        .replace(/^\s*\|\s*/, '') // leading |
        .replace(/\s*\|\s*$/, '') // trailing |
        .replace(/\s+/g, ' ');
      cleaned = cleaned.replace(/;$/, '');
      return `export type AppRole =${cleaned};`;
    });
    // Clean up array
    rolesContent = rolesContent.replace(/export const APP_ROLES: AppRole\[] = \[([^\]]*)\];/, (match, p1) => {
      let arr = p1.split(',').map(s => s.trim()).filter(Boolean);
      let cleaned = arr.join(', ');
      return `export const APP_ROLES: AppRole[] = [${cleaned}];`;
    });

    if (!dryRun) fs.writeFileSync(rolesFile, rolesContent);
    console.log(`Role "${roleName}" deleted from roles.ts.`);
    return;
  }

  // Add to union
  if (!rolesContent.includes(`'${roleName}'`)) {
    rolesContent = rolesContent.replace(unionRegex, (match, p1) => {
      return `export type AppRole =${p1.trim()} | '${roleName}';`;
    });
    // Add to array
    rolesContent = rolesContent.replace(arrayRegex, (match, p1) => {
      return `export const APP_ROLES: AppRole[] = [${p1.trim()}${p1.trim() ? ', ' : ''}'${roleName}'];`;
    });
    if (!dryRun) fs.writeFileSync(rolesFile, rolesContent);
    console.log(`Role "${roleName}" added to roles.ts.`);
  } else {
    console.log(`Role "${roleName}" already exists in roles.ts.`);
  }
}

main();
