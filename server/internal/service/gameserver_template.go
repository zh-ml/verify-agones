package service

import (
	"bytes"
	"fmt"
	"os"
	"text/template"
)

type GameServerTemplateVars interface {
	RenderGameServerYAML() (string, error)
}

type GameServerBaseTemplateVars struct {
	ContainerName string `yaml:"containerName"`
	Image         string `yaml:"image"`
}

type GSMinecraftTemplateVars struct {
	GameServerBaseTemplateVars `yaml:",inline"`
	Label                      string `yaml:"label"`
	Hostname                   string `yaml:"hostname"`
	ServiceName                string `yaml:"serviceName"`
	GenerateName               string `yaml:"generateName"`
	Protocol                   string `yaml:"protocol"`
	PortName                   string `yaml:"portName"`
	PortPolicy                 string `yaml:"portPolicy"`
	EULA                       string `yaml:"eula"`
	Version                    string `yaml:"version"`
	OnlineMode                 string `yaml:"onlineMode"`
	HealthInitialDelay         int    `yaml:"healthInitialDelay"`
	HealthPeriod               int    `yaml:"healthPeriod"`
	HealthFailure              int    `yaml:"healthFailure"`
	CpuResource                string `yaml:"cpuResource"`
	MemoryResource             string `yaml:"memoryResource"`
}

// func RenderGameServerYAML(vars GSMinecraftTemplateVars) (string, error) {
// 	gameServerYAMLTemplate, err := os.ReadFile("internal/templates/gs-minecraft.yaml.tmpl")
// 	if err != nil {
// 		return "", err
// 	}
// 	// fmt.Printf("%+v\n", vars)
// 	tmpl := template.Must(template.New("gs-minecraft").Parse(string(gameServerYAMLTemplate)))

// 	// err = tmpl.Execute(os.Stdout, vars)
// 	// if err != nil {
// 	// 	panic(err)
// 	// }

// 	var buf bytes.Buffer
// 	if err := tmpl.Execute(&buf, vars); err != nil {
// 		return "", fmt.Errorf("template execution failed: %v", err)
// 	}

// 	return buf.String(), nil
// }

func (mc *GSMinecraftTemplateVars) RenderGameServerYAML() (string, error) {
	gameServerYAMLTemplate, err := os.ReadFile("internal/templates/gs-minecraft.yaml.tmpl")
	if err != nil {
		return "", err
	}
	// fmt.Printf("%+v\n", vars)
	tmpl := template.Must(template.New("gs-minecraft").Parse(string(gameServerYAMLTemplate)))

	// err = tmpl.Execute(os.Stdout, vars)
	// if err != nil {
	// 	panic(err)
	// }

	var buf bytes.Buffer
	if err := tmpl.Execute(&buf, mc); err != nil {
		return "", fmt.Errorf("template execution failed: %v", err)
	}

	return buf.String(), nil
}

func HandlerRenderGameServerYAML(template GameServerTemplateVars) (string, error) {
	yamlData, err := template.RenderGameServerYAML()
	if err != nil {
		return "", fmt.Errorf("failed to render GameServer YAML: %v", err)
	}
	return yamlData, nil
}
