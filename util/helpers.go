package util

import (
	"strings"
	"teka/constants"
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
