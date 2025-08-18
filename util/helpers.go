package util

import (
	"fmt"
	"runtime"
	"teka/constants"
	"time"
)

func ParsePublishedDate(dateStr string) *time.Time {
	parsedPublished, err := time.Parse(constants.ReferenceTimeLayout, dateStr)
	var published *time.Time
	if err == nil {
		published = PointerTime(parsedPublished)
	} else {
		published = nil
	}

	return published
}

func Logger(format string, a ...interface{}) {
	if constants.FullLoggingEnabled && constants.CliMode {
		t := time.Now().Format(time.RFC3339)
		fmt.Printf("["+t+"] ["+printCaller()+"] "+format+"\n", a...)
	}
}

func printCaller() string {
	pc, _, _, ok := runtime.Caller(2)
	if !ok {
		fmt.Println("Could not get caller info")
		return constants.EmptyString
	}
	fn := runtime.FuncForPC(pc)
	return fn.Name()
}
