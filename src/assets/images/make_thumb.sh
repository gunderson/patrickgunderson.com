#it's a one-liner

ffmpeg -i main.jpg -vf scale=-1:128 _main.jpg
ffmpeg -i detail0.jpg -vf scale=-1:128 _detail0.jpg
# ffmpeg -i detail1.jpg -vf scale=-1:128 _detail1.jpg
ffmpeg -i wallpaper.jpg -vf scale=-1:128 _wallpaper.jpg