#!/usr/bin/env node

/**
 * Script to verify and fix PocketBase collection rules
 * Run with: node fix_rules.js
 */

const PocketBase = require('pocketbase/cjs');
const readline = require('readline');

const pb = new PocketBase('http://127.0.0.1:8090');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  try {
    console.log('=== PocketBase Collection Rules Fixer ===\n');
    
    // Try to authenticate as admin
    const email = process.argv[2] || await question('Enter admin email: ');
    const password = process.argv[3] || await question('Enter admin password: ');
    
    console.log('\nAuthenticating...');
    await pb.admins.authWithPassword(email, password);
    console.log('✓ Authentication successful!\n');
    
    // Get all collections
    const collections = await pb.collections.getFullList();
    
    console.log('=== All Collections ===');
    collections.forEach(c => {
      console.log(`- ${c.name} (${c.id})`);
    });
    console.log('');
    
    // Find our collections
    const comments = collections.find(c => c.name === 'comments');
    const reactions = collections.find(c => c.name === 'reactions');
    const examSchedules = collections.find(c => c.name === 'exam_schedules');
    const subjects = collections.find(c => c.name === 'subjects');
    const classSections = collections.find(c => c.name === 'class_sections');
    
    console.log('=== Current Collection Status ===\n');
    
    // Check comments collection
    if (comments) {
      console.log('📋 COMMENTS Collection:');
      console.log('  ID:', comments.id);
      console.log('  Fields:', comments.schema?.map(f => `${f.name} (${f.type})`).join(', '));
      console.log('  List Rule:', comments.listRule || 'null');
      console.log('  View Rule:', comments.viewRule || 'null');
      console.log('  Create Rule:', comments.createRule || 'null');
      console.log('  Update Rule:', comments.updateRule || 'null');
      console.log('  Delete Rule:', comments.deleteRule || 'null');
      console.log('');
    } else {
      console.log('❌ COMMENTS collection not found!\n');
    }
    
    // Check reactions collection
    if (reactions) {
      console.log('❤️  REACTIONS Collection:');
      console.log('  ID:', reactions.id);
      console.log('  Fields:', reactions.schema?.map(f => `${f.name} (${f.type})`).join(', '));
      console.log('  List Rule:', reactions.listRule || 'null');
      console.log('  View Rule:', reactions.viewRule || 'null');
      console.log('  Create Rule:', reactions.createRule || 'null');
      console.log('  Update Rule:', reactions.updateRule || 'null');
      console.log('  Delete Rule:', reactions.deleteRule || 'null');
      console.log('');
    } else {
      console.log('❌ REACTIONS collection not found!\n');
    }
    
    // Check exam_schedules collection
    if (examSchedules) {
      console.log('📅 EXAM_SCHEDULES Collection:');
      console.log('  ID:', examSchedules.id);
      console.log('  Fields:', examSchedules.schema?.map(f => `${f.name} (${f.type})`).join(', '));
      console.log('  List Rule:', examSchedules.listRule || 'null');
      console.log('  View Rule:', examSchedules.viewRule || 'null');
      console.log('  Create Rule:', examSchedules.createRule || 'null');
      console.log('  Update Rule:', examSchedules.updateRule || 'null');
      console.log('  Delete Rule:', examSchedules.deleteRule || 'null');
      console.log('');
    } else {
      console.log('❌ EXAM_SCHEDULES collection not found!\n');
    }
    
    // Check subjects collection
    if (subjects) {
      console.log('📚 SUBJECTS Collection:');
      console.log('  ID:', subjects.id);
      console.log('  List Rule:', subjects.listRule || 'null');
      console.log('  View Rule:', subjects.viewRule || 'null');
      console.log('');
    }
    
    // Check class_sections collection
    if (classSections) {
      console.log('🏫 CLASS_SECTIONS Collection:');
      console.log('  ID:', classSections.id);
      console.log('  List Rule:', classSections.listRule || 'null');
      console.log('  View Rule:', classSections.viewRule || 'null');
      console.log('');
    }
    
    // Ask if user wants to fix rules
    const fix = process.argv[4] || await question('\nDo you want to fix the rules? (yes/no): ');
    
    if (fix.toLowerCase() === 'yes' || fix.toLowerCase() === 'y') {
      console.log('\n=== Fixing Rules ===\n');
      
      // Fix comments deleteRule - allow users to delete their own OR admins
      if (comments) {
        try {
          await pb.collections.update(comments.id, {
            listRule: '@request.auth.id != ""',
            viewRule: '@request.auth.id != ""',
            deleteRule: '@request.auth.id != ""'
          });
          console.log('✓ Fixed comments rules (list, view, delete)');
        } catch (e) {
          console.log('✗ Failed to fix comments:', e.message);
        }
      }
      
      // Fix reactions deleteRule
      if (reactions) {
        try {
          await pb.collections.update(reactions.id, {
            listRule: '@request.auth.id != ""',
            viewRule: '@request.auth.id != ""',
            deleteRule: '@request.auth.id != ""'
          });
          console.log('✓ Fixed reactions rules (list, view, delete)');
        } catch (e) {
          console.log('✗ Failed to fix reactions:', e.message);
        }
      }
      
      // Verify exam_schedules has correct read rules
      if (examSchedules) {
        try {
          await pb.collections.update(examSchedules.id, {
            listRule: '@request.auth.id != ""',
            viewRule: '@request.auth.id != ""',
            updateRule: '@request.auth.role = "admin"'
          });
          console.log('✓ Verified exam_schedules rules (list, view, update)');
        } catch (e) {
          console.log('✗ Failed to fix exam_schedules:', e.message);
        }
      }
      
      console.log('\n✅ Rules update complete!');
      console.log('Note: Delete rules are temporarily permissive. Frontend handles authorization.');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    rl.close();
  }
}

main();
