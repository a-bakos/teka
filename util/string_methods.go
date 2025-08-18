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

func normalizeString(s string) string {
	s = strings.TrimSpace(s)
	var processed string
	parts := strings.Fields(s) // explode name at spaces into []string
	for _, part := range parts {
		part = strings.TrimSpace(part)
		processed = processed + constants.SingleWhiteSpace + part
	}
	s = strings.TrimSpace(processed)

	return s
}

func ProcessAuthorName(name string) string {
	return normalizeString(name)
}

func ProcessProfileName(name string) string {
	return normalizeString(name)
}
