const fs = require('fs');
const path = require('path');

// Map of common Bootstrap responsive classes to be added
const responsiveClasses = {
  // Card headers
  'card-header d-flex justify-content-between align-items-center': 'card-header d-flex justify-content-between align-items-center flex-wrap inventory-card-header',
  'mat-card-header class="card-header d-flex justify-content-between align-items-center"': 'mat-card-header class="card-header d-flex justify-content-between align-items-center inventory-card-header"',
  
  // Card content
  'mat-card-content': 'mat-card-content class="inventory-card-content"',
  'card-body': 'card-body inventory-card-content',
  
  // Tables
  'table w-100': 'table table-sm w-100',
  'table ': 'table table-sm ',
  'mat-elevation-z4 card': 'mat-elevation-z4 card inventory-table-responsive',
  'app-card': 'app-card class="inventory-table-responsive"',
  
  // Form controls
  'col-md-3': 'col-md-3 col-sm-6 col-12',
  'col-md-4': 'col-md-4 col-sm-6 col-12', 
  'col-md-6': 'col-md-6 col-12',
  'col-lg-3': 'col-lg-3 col-md-6 col-12',
  'col-lg-4': 'col-lg-4 col-md-6 col-12',
  'col-lg-6': 'col-lg-6 col-md-12',
  
  // Button groups
  'd-flex gap-2': 'd-flex gap-2 flex-wrap',
  'd-flex gap-2 align-items-center': 'd-flex gap-2 align-items-center flex-wrap',
  
  // Table headers
  'mat-header-cell \\*matHeaderCellDef': 'mat-header-cell *matHeaderCellDef class="text-nowrap"',
  'th mat-header-cell': 'th mat-header-cell class="text-nowrap"',
  
  // Table cells
  'td mat-cell': 'td mat-cell class="text-break"',
  
  // Pagination
  'mt-3': 'mt-3 inventory-pagination-responsive'
};

// Classes to add for responsive behavior
const additionalClasses = {
  // For mobile action buttons
  'mat-icon-button': 'mat-icon-button btn-sm',
  'btn-group': 'btn-group btn-group-sm d-flex flex-column flex-sm-row gap-1',
  
  // For text content
  'text-break': true,
  'text-nowrap': true,
  
  // For dialog forms
  'inventory-form-responsive': true,
  'inventory-dialog-responsive': true,
  'inventory-buttons-responsive': true
};

function makeResponsive(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Apply responsive class replacements
    for (const [oldClass, newClass] of Object.entries(responsiveClasses)) {
      const regex = new RegExp(oldClass.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      if (content.includes(oldClass)) {
        content = content.replace(regex, newClass);
        modified = true;
        console.log(`Updated: ${oldClass} -> ${newClass} in ${path.basename(filePath)}`);
      }
    }
    
    // Add responsive wrapper for dialogs
    if (filePath.includes('dialog') && !content.includes('inventory-dialog-responsive')) {
      content = content.replace(
        /^(<h1 mat-dialog-title>)/m,
        '<div class="inventory-dialog-responsive">\n$1'
      );
      content = content.replace(
        /(<\/div>\s*$)/m,
        '$1\n</div>'
      );
      modified = true;
    }
    
    // Add responsive classes to form groups
    if (content.includes('formGroup') && !content.includes('inventory-form-responsive')) {
      content = content.replace(
        /class="form-group/g,
        'class="form-group inventory-form-responsive'
      );
      modified = true;
    }
    
    // Enhance button tooltips for mobile
    content = content.replace(
      /(mat-icon-button[^>]*>)\s*<mat-icon>edit<\/mat-icon>/g,
      '$1<mat-icon class="small-icon">edit</mat-icon>'
    );
    content = content.replace(
      /(mat-icon-button[^>]*>)\s*<mat-icon>delete<\/mat-icon>/g,
      '$1<mat-icon class="small-icon">delete</mat-icon>'
    );
    
    // Add tooltips to buttons if not present
    content = content.replace(
      /(mat-icon-button[^>]*color="primary"[^>]*(?!matTooltip))/g,
      '$1 matTooltip="Chỉnh sửa"'
    );
    content = content.replace(
      /(mat-icon-button[^>]*color="warn"[^>]*(?!matTooltip))/g,
      '$1 matTooltip="Xóa"'
    );
    
    // Hide columns on mobile for large tables
    if (content.includes('matColumnDef="moTa"') || content.includes('matColumnDef="description"')) {
      content = content.replace(
        /(th mat-header-cell \*matHeaderCellDef[^>]*)>/g,
        '$1 class="d-none d-lg-table-cell">'
      );
      content = content.replace(
        /(td mat-cell \*matCellDef[^>]*)(>.*?<\/td>)/gs,
        '$1 class="text-break d-none d-lg-table-cell"$2'
      );
    }
    
    // Add hover effects to table rows
    content = content.replace(
      /mat-row \*matRowDef/g,
      'mat-row *matRowDef="let row; columns: displayedColumns;" class="table-row-hover"'
    );
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Successfully updated: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath, { withFileTypes: true });
  let processedCount = 0;
  
  for (const file of files) {
    const fullPath = path.join(dirPath, file.name);
    
    if (file.isDirectory()) {
      processedCount += processDirectory(fullPath);
    } else if (file.name.endsWith('.html')) {
      if (makeResponsive(fullPath)) {
        processedCount++;
      }
    }
  }
  
  return processedCount;
}

// Main execution
const inventoryDir = path.join(__dirname);
console.log(`🚀 Starting responsive transformation for: ${inventoryDir}`);
console.log('=' .repeat(50));

const processedCount = processDirectory(inventoryDir);

console.log('=' .repeat(50));
console.log(`✨ Transformation complete! Processed ${processedCount} files.`);
console.log('🎯 All InventoryManagement components are now responsive!');
