/** @type {import('next').NextConfig} */
const nextConfig = {
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 2a0d631 (Sync app folder contract files with master)
	webpack: (config) => {
		config.externals.push("pino-pretty", "lokijs", "encoding");
		return config;
	},
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 6cef9cc (Artist section ready)
=======
>>>>>>> 59d19ed (Artist section ready)
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "images.unsplash.com",
			},
		],
	},
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> a90277f (Sync app folder contract files with master)
=======
>>>>>>> 6cef9cc (Artist section ready)
=======
>>>>>>> 59d19ed (Artist section ready)
};

=======
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
};
>>>>>>> 6a58ccf (App ui update)
=======
};

>>>>>>> 2a0d631 (Sync app folder contract files with master)
export default nextConfig;
