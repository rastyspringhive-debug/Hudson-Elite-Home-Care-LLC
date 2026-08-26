import sys
try:
    from PIL import Image
    import math

    img_path = sys.argv[1]
    out_path = sys.argv[2]
    
    img = Image.open(img_path).convert("RGBA")
    data = img.getdata()
    
    # We assume the top-left pixel is the background color
    bg_color = data[0]
    
    newData = []
    # threshold for color distance
    threshold = 60
    
    for item in data:
        # Distance between two colors
        diff = math.sqrt(sum((a - b) ** 2 for a, b in zip(item[:3], bg_color[:3])))
        
        if diff < threshold:
            newData.append((255, 255, 255, 0)) # Transparent
        else:
            newData.append(item)
            
    img.putdata(newData)
    img.save(out_path, "PNG")
    print("Success")
except Exception as e:
    print("Error:", e)
