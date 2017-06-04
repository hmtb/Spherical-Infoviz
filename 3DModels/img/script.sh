
# for i in {2002..2016}; 
# do 
#     # set $x = ;
#     set $z = $2;
#     echo $1;
#     for y in {1..12};
#     do
   
#     echo https://climate.nasa.gov/system/time_series_images/${x}_co2_${i}_${y}_015${z}_720x360.jpg;
#      mv "$file" "${file/_h.png/_half.png}"
#     done
# done



for file in *.jpg
do
  new=${file/12_}
  mv $file $new
done
