package util

import (
	"fmt"
	"runtime"
	"strings"
	"teka/constants"
	"time"
)

func NormalizeRole(role string) string {
	role = strings.ToLower(role)
	role = strings.TrimSpace(role)
	switch role {
	case constants.RoleAuthor:
		return constants.RoleAuthor
	default:
		return constants.RoleUnknown
	}
}

func SplitMultiAuthorString(authors string) []string {
	return strings.Split(authors, constants.MultiAuthorSeparator)
}

func ProcessAuthorName(name string) string {
	name = strings.TrimSpace(name)
	var processedName string
	nameParts := strings.Fields(name) // // explode name at spaces into []string
	for _, namePart := range nameParts {
		namePart = strings.TrimSpace(namePart)
		processedName = processedName + constants.SingleWhiteSpace + namePart
	}
	name = strings.TrimSpace(processedName)

	return name
}

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
