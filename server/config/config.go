package config

import (
	"log"
	"os"
)

type Config struct {
	ServerPort string
	KubeConfig string
	JWTSecret  string
	Namespace  string
}

func LoadConfig() *Config {
	cfg := &Config{
		ServerPort: getEnv("SERVER_PORT", ":8080"),
		KubeConfig: getEnv("KUBECONFIG", ""), // "/Users/kc-user/.kube/config"
		JWTSecret:  getEnv("JWT_SECRET", "your-default-jwt-secret"),
		Namespace:  getEnv("NAMESPACE", "kube-system"),
	}

	log.Printf("Loaded config: %+v\n", cfg)
	return cfg
}

func getEnv(key, defaultValue string) string {
	val := os.Getenv(key)
	if val == "" {
		return defaultValue
	}
	return val
}
