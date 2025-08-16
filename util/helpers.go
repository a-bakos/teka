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
