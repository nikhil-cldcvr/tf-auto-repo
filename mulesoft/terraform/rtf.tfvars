//anypoint_region = "us-east-2"
cluster_name="DXP-OL-MULESOFT-Dev" 
key_pair="DXPOLMULEEC2" 
controllers=1 
workers=2 
enable_public_ips=false 
activation_data="YW55cG9pbnQubXVsZXNvZnQuY29tOjBlYzBmYjI4LWFjMDEtNGM3ZC04N2I1LWU5NDA0ZmVjOWZjNQ=="
mule_license="2+W35iUhD9kdDTY4HOxAV0tAM1SLLssrI1iqj903kac4/gC6w9oiQgY1e0d7LycNJamWmDU2g/W0kAWxinBWbShtVjjUBc7umFL3PYEZry5UO0FZNKmZK0b7s5jmAqO5vRZxeNdkW5j+54dQvDcnGAFY+jnBNEw0k1Hz5bx/1ZI7FSWG5POvljIIJ9vjXvhZdZ37Dra57AjARQ8rpEtx37vPApVkLKhmmiTCJ0xzBk78mSQ2pTy6s7vHXxy7Gi96H+s41fW6HxjEwj45Eo38TUohOzYIIaQrntKkc1czfCTEwRzu194SnlQiW+3yOj3OgJY1jhbu/GjLxuImbcgmSCZL8roX6KTtUOQwublPxfobbA8pceNITMAP9AMWUV/SFxmiNe3Kob0XXZMv60s4b6mpfdgBhsfZyz+NbySqSnsFNRkxC6a7eNcinyRpeuVpuWhN6JMo+gh0kChxRmx6dYq1FukS7UHopSvItlxDPznUb3sU1CXN33Tes6ZFO3KjWHB+xkHq2nVT1k3QF0c6hZf1jGQmDAW0CFKBWyLmXZ/lLqRE98xCWee3wDx3UR7AuC/CsB4MOA/UbTuTrbDlIFhmqoFRi1gl0xHDy4iCL/q3rflCedg6RPOpvJ7VcKiQOdLnO6tDDY8G4spnFBHZNjO/IqvOJcGUYVUSlplRxslfexnt0bacv1KXBjjFRnBgQk1Rmt5rt59bVs75JtO5beigtpKGTi2a7/JUhn6xQQKWKNFg4kGBCODzPO0H4RhGyizW40pzMQD29N2ZkSeaFFnwZqfD8zb7xJnO15jG0sYS7obGTcKLvg7u77+oW+QHGGiW/363kQkYyh5VJyxeo+zg7/dloldKvxmfwowzt4rhE5kuaVqDn/R7WxXwf/9V"
// Optional vars
existing_vpc_id="vpc-0cc588ea807e0e2c5"
existing_subnet_ids=["subnet-0c1a38128c6852f90", "subnet-0740ba476389be714", "subnet-03058628f10b70cb7", "subnet-0847dac8eb0fd9643"] 
//enable_public_ips  # Apply public ips (default `false`)
//existing_vpc_id and existing_subnet_ids: Allow creating the cluster in existing VPC
//http_proxy  # Host:port of an HTTP forward proxy to use for outbound connections (e.g. `192.168.1.1:1390`)
//no_proxy # Comma-separated list of hosts which should bypass the HTTP proxy (e.g. `bypass-host1,bypass-host2`)
//monitoring_proxy #SOCKS5 proxy to use for Anypoint Monitoring publisher outbound connections (e.g. `socks5://192.169.1.1:1080`, `socks5://user:pass@192.168.1.1:1080`)
//service_uid # Service user ID for running system services (e.g. `1002`)
//service_gid # Service group ID for running system services (e.g. `1002`)
//pod_network_cidr_block # Support for a custom pod CIDR block. (e.g. `10.244.0.0/16`)
//service_cidr_block # Support for a custom service CIDR block. (e.g. `10.100.0.0/16`)
//installer_url # URL of the RTF installation package
