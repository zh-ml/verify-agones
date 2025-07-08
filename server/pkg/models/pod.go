package models

type PodInfo struct {
	Name   string  `json:"name"`
	IP     string  `json:"ip,omitempty"`
	Ports  []int32 `json:"ports,omitempty"`
	Status string  `json:"status"`
}
