package k8s

import (
	"fmt"
	"log"
	"os"
	"path/filepath"

	"klabchina/server/config"

	agones "agones.dev/agones/pkg/client/clientset/versioned"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/clientcmd"
)

func NewAgonesClient(cfg *config.Config) *agones.Clientset {
	var err error
	var kubeConfig *rest.Config

	if cfg.KubeConfig != "" {

		fmt.Printf("Using kubeconfig from config: %s\n", cfg.KubeConfig)
		kubeConfig, err = clientcmd.BuildConfigFromFlags("", cfg.KubeConfig)
		if err != nil {
			fmt.Printf("error getting Kubernetes config from file: %v\n", err)
			os.Exit(1)
		}
	} else {
		userHomeDir, err := os.UserHomeDir()
		if err != nil {
			fmt.Printf("error getting user home dir: %v\n", err)
			os.Exit(1)
		}
		kubeConfigPath := filepath.Join(userHomeDir, ".kube", "config")
		fmt.Printf("Using kubeconfig: %s\n", kubeConfigPath)

		kubeConfig, err = clientcmd.BuildConfigFromFlags("", kubeConfigPath)
		if err != nil {
			fmt.Printf("error getting Kubernetes config: %v\n", err)
			os.Exit(1)
		}
	}

	if err != nil {
		log.Fatalf("Failed to load kubeconfig: %v", err)
	}

	clientset, err := agones.NewForConfig(kubeConfig)
	if err != nil {
		log.Fatalf("Failed to create k8s client: %v", err)
	}

	return clientset
}
