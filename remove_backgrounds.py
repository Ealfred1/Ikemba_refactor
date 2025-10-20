#!/usr/bin/env python3
"""
Automatic Background Removal Script for Ikemba Images
This script removes backgrounds from all images in the ikemba_images folder
"""

import os
import sys
from pathlib import Path
from PIL import Image
import requests
import io

def remove_background_with_rembg(input_path, output_path):
    """
    Remove background using rembg library (AI-powered)
    """
    try:
        from rembg import remove, new_session
        
        # Load image
        with open(input_path, 'rb') as input_file:
            input_data = input_file.read()
        
        # Remove background
        output_data = remove(input_data, session=new_session('u2net'))
        
        # Save result
        with open(output_path, 'wb') as output_file:
            output_file.write(output_data)
        
        print(f"✅ Background removed: {os.path.basename(input_path)}")
        return True
        
    except ImportError:
        print("❌ rembg library not installed. Installing...")
        return False
    except Exception as e:
        print(f"❌ Error processing {input_path}: {str(e)}")
        return False

def remove_background_simple(input_path, output_path):
    """
    Simple background removal using PIL (basic method)
    """
    try:
        # Open image
        img = Image.open(input_path)
        
        # Convert to RGBA if not already
        if img.mode != 'RGBA':
            img = img.convert('RGBA')
        
        # Get image data
        data = img.getdata()
        
        # Create new image data
        new_data = []
        for item in data:
            # Simple threshold-based background removal
            # This works best with white/light backgrounds
            if item[0] > 240 and item[1] > 240 and item[2] > 240:  # White background
                new_data.append((255, 255, 255, 0))  # Transparent
            else:
                new_data.append(item)
        
        # Update image data
        img.putdata(new_data)
        
        # Save as PNG to preserve transparency
        img.save(output_path, 'PNG')
        print(f"✅ Simple background removal: {os.path.basename(input_path)}")
        return True
        
    except Exception as e:
        print(f"❌ Error processing {input_path}: {str(e)}")
        return False

def install_rembg():
    """
    Install rembg library for AI background removal
    """
    try:
        import subprocess
        subprocess.check_call([sys.executable, '-m', 'pip', 'install', 'rembg'])
        print("✅ rembg library installed successfully!")
        return True
    except Exception as e:
        print(f"❌ Failed to install rembg: {str(e)}")
        return False

def process_all_images():
    """
    Process all images in ikemba_images folder
    """
    # Get the directory of this script
    script_dir = Path(__file__).parent
    ikemba_dir = script_dir / "ikemba_images"
    
    if not ikemba_dir.exists():
        print(f"❌ Ikemba images directory not found: {ikemba_dir}")
        return
    
    # Supported image extensions
    image_extensions = {'.jpg', '.jpeg', '.png', '.webp', '.bmp'}
    
    # Count total images
    total_images = 0
    processed_images = 0
    
    # Walk through all subdirectories
    for root, dirs, files in os.walk(ikemba_dir):
        for file in files:
            if Path(file).suffix.lower() in image_extensions:
                total_images += 1
    
    print(f"📁 Found {total_images} images to process...")
    
    # Process each image
    for root, dirs, files in os.walk(ikemba_dir):
        for file in files:
            if Path(file).suffix.lower() in image_extensions:
                input_path = Path(root) / file
                
                # Create output path with "_no_bg" suffix
                output_name = f"{Path(file).stem}_no_bg.png"
                output_path = Path(root) / output_name
                
                # Try AI background removal first
                if remove_background_with_rembg(str(input_path), str(output_path)):
                    processed_images += 1
                else:
                    # Try simple background removal
                    print(f"🔄 Trying simple background removal for {file}...")
                    if remove_background_simple(str(input_path), str(output_path)):
                        processed_images += 1
                    else:
                        print(f"❌ Failed to process {file}")
    
    print(f"\n🎉 Processing complete! {processed_images}/{total_images} images processed successfully.")
    print("📝 Files with '_no_bg.png' suffix have transparent backgrounds.")

def main():
    """
    Main function
    """
    print("🎨 Ikemba Images Background Removal Tool")
    print("=" * 50)
    
    # Check if rembg is available
    try:
        import rembg
        print("✅ AI background removal available")
    except ImportError:
        print("⚠️  AI background removal not available. Installing...")
        if install_rembg():
            print("✅ AI background removal installed!")
        else:
            print("⚠️  Will use simple background removal method")
    
    # Process all images
    process_all_images()
    
    print("\n💡 Tips:")
    print("- Files with '_no_bg.png' suffix have transparent backgrounds")
    print("- You can now use these images in your slider")
    print("- PNG format preserves transparency")

if __name__ == "__main__":
    main()
