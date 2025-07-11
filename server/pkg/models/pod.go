package models

type PodInfo struct {
	Name   string  `json:"name"`
	IP     string  `json:"ip,omitempty"`
	Ports  []int32 `json:"ports,omitempty"`
	Status string  `json:"status"`
}

type GameServerInfo struct {
	Name   string  `json:"name"`
	IP     string  `json:"ip,omitempty"`
	Port   int32 `json:"port,omitempty"`
	Status string  `json:"status,omitempty"`
}
