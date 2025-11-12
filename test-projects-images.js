/**
 * Test script to verify project images are returned by API
 */

const PROJECT_ID = 'ptcxeqtjlxittxayffgu';
const API_URL = `https://${PROJECT_ID}.supabase.co/functions/v1/make-server-04919ac5`;

async function testProjectsAPI() {
  console.log('🧪 Testing Projects API...\n');
  
  // Test 1: Get all projects (FR)
  console.log('📋 Test 1: GET /projects?lang=fr');
  try {
    const response = await fetch(`${API_URL}/projects?lang=fr`);
    const data = await response.json();
    
    console.log(`✅ Status: ${response.status}`);
    console.log(`✅ Projects count: ${data.projects?.length || 0}`);
    
    if (data.projects && data.projects.length > 0) {
      const project = data.projects[0];
      console.log(`\n📦 First project sample:`);
      console.log(`   ID: ${project.id}`);
      console.log(`   Title: ${project.title || project.name}`);
      console.log(`   Image URL: ${project.imageUrl || 'MISSING ❌'}`);
      console.log(`   Cover Image: ${project.coverImage || 'N/A'}`);
      console.log(`   Has imageUrl field: ${project.imageUrl ? '✅ YES' : '❌ NO'}`);
      
      // Check all projects
      const projectsWithImages = data.projects.filter(p => p.imageUrl);
      const projectsWithCoverImage = data.projects.filter(p => p.coverImage);
      console.log(`\n📊 Image statistics:`);
      console.log(`   Projects with imageUrl: ${projectsWithImages.length}/${data.projects.length}`);
      console.log(`   Projects with coverImage: ${projectsWithCoverImage.length}/${data.projects.length}`);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  // Test 2: Get all projects (EN)
  console.log('📋 Test 2: GET /projects?lang=en');
  try {
    const response = await fetch(`${API_URL}/projects?lang=en`);
    const data = await response.json();
    
    console.log(`✅ Status: ${response.status}`);
    console.log(`✅ Projects count: ${data.projects?.length || 0}`);
    
    if (data.projects && data.projects.length > 0) {
      const project = data.projects[0];
      console.log(`\n📦 First project sample:`);
      console.log(`   ID: ${project.id}`);
      console.log(`   Title: ${project.title || project.name}`);
      console.log(`   Image URL: ${project.imageUrl || 'MISSING ❌'}`);
      console.log(`   Has imageUrl field: ${project.imageUrl ? '✅ YES' : '❌ NO'}`);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  // Test 3: Get single project by ID
  console.log('📋 Test 3: GET /projects/:id (using first project)');
  try {
    // First get all projects to get an ID
    const listResponse = await fetch(`${API_URL}/projects?lang=fr`);
    const listData = await listResponse.json();
    
    if (listData.projects && listData.projects.length > 0) {
      const firstProjectId = listData.projects[0].id;
      
      const response = await fetch(`${API_URL}/projects/${firstProjectId}?lang=fr`);
      const data = await response.json();
      
      console.log(`✅ Status: ${response.status}`);
      
      if (data.project) {
        const project = data.project;
        console.log(`\n📦 Project details:`);
        console.log(`   ID: ${project.id}`);
        console.log(`   Title: ${project.title || project.name}`);
        console.log(`   Image URL: ${project.imageUrl || 'MISSING ❌'}`);
        console.log(`   Cover Image: ${project.coverImage || 'N/A'}`);
        console.log(`   Has imageUrl field: ${project.imageUrl ? '✅ YES' : '❌ NO'}`);
      }
    } else {
      console.log('⚠️ No projects available to test single project endpoint');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ Tests completed!\n');
}

// Run tests
testProjectsAPI();
