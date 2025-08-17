package util

import (
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
	// explode name at spaces
	nameParts := strings.Fields(name) // slice []string
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
