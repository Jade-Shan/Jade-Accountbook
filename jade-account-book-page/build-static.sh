#!/bin/bash

echo "Tips:"
echo "-p html inclue"
echo "-s less build"
echo "-a all"

while getopts "b:aps" arg #选项后面的冒号表示该选项需要参数
do
	case $arg in
		p)
			gulp clean-html;
			sleep 3;
			gulp include-html;
			;;
		s)
			gulp clean-css;
			sleep 3;
			gulp build-less-base;
			;;
		a)
			gulp clean-css;
			sleep 3;
			gulp build-less-base;
			sleep 3;
			gulp min-styles-base;

			gulp clean-scripts;
			gulp check-scripts;
			sleep 3;
			gulp min-scripts;

			gulp clean-html;
			sleep 3;
			gulp process-html;
			sleep 3;
			# qrsync ~/.config/qiniu/workout.json ;
			;;
		?)  #当有不认识的选项的时候arg为?
			exit 1
			;;
	esac
done
