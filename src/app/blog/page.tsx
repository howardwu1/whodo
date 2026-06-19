import Link from 'next/link';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';

function BlogArticle() {
  return (
    <Paper className="!p-6 !rounded-xl !mb-6 !shadow-sm">
      <Box className="flex gap-4 mb-4">
        <Avatar
          src="/blank-profile-picture-973460_1280.webp"
          alt="profile"
          sx={{ width: 80, height: 80 }}
        />
        <Box>
          <Typography variant="body2" className="!text-gray-500">
            Written by:{' '}
            <Link href="/author/howard-lorum-wu" className="!text-indigo-600 hover:!underline">
              Howard Lorum Wu
            </Link>{' '}
            on December 18, 2022
          </Typography>
          <Typography variant="h4" className="!font-semibold !text-gray-800">
            What is WhoDo
          </Typography>
        </Box>
      </Box>
      <Box className="mb-4">
        <img src="/sample-1.jpeg" alt="sample" className="!w-full !rounded-lg" />
      </Box>
      <Typography variant="body1" className="!text-gray-600 !leading-relaxed">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum
        vel tortor pharetra diam porta rhoncus non id nibh. Aliquam vitae
        tortor tristique, accumsan ligula quis, fermentum leo. In non sapien
        non tortor blandit efficitur. In ligula justo, feugiat nec tellus
        sed, consectetur ultrices magna. In cursus, mauris et porta
        ultrices, libero nunc bibendum odio, eu facilisis enim turpis id
        lorem. Phasellus massa ipsum, hendrerit vitae metus quis, efficitur
        sodales purus. Etiam rutrum hendrerit ex, ut congue ex auctor non.
        Sed interdum orci dui, nec porttitor enim malesuada nec. Proin nibh
        orci, porta feugiat cursus a, fringilla a nisl. Fusce euismod
        consequat sapien, eu rutrum odio.
      </Typography>
    </Paper>
  );
}

function LinkCard({ title, links }: { title: string; links: { text: string; href: string }[] }) {
  return (
    <Paper className="!p-4 !rounded-xl !mb-4 !shadow-sm">
      <Typography variant="h6" className="!font-semibold !mb-3 !text-gray-800">
        {title}
      </Typography>
      <Box component="ul" className="!list-none !p-0 !m-0">
        {links.map((link, index) => (
          <li key={index} className="!mb-2">
            <Link href={link.href} className="!text-indigo-600 hover:!underline text-sm">
              {link.text}
            </Link>
          </li>
        ))}
      </Box>
    </Paper>
  );
}

export default function Blog() {
  return (
    <Box className="overflow-y-auto" sx={{ maxHeight: '90vh' }}>
      <Box className="max-w-5xl mx-auto !px-6 !py-8">
        <Box className="mb-8 text-center">
          <Typography variant="h3" className="!font-bold !text-gray-800 !mb-2">
            WhoDo Blog
          </Typography>
          <Typography variant="h6" className="!text-gray-500 !font-normal">
            All things WhoDo - Updates/News/Random Musings
          </Typography>
        </Box>

        <Box className="flex flex-col lg:flex-row gap-6">
          <Box className="flex-1">
            <BlogArticle />
          </Box>
          <Box className="lg:w-72">
            <LinkCard
              title="New To WhoDo"
              links={[
                { text: 'How To Get Set Up', href: '#' },
                { text: 'Contributing to WhoDo', href: '#' },
                { text: 'Microcontracting and WhoDo', href: '#' },
              ]}
            />
            <LinkCard
              title="Blog Posts"
              links={[
                { text: 'Our Philosophy On Mentorship and Giving Back', href: '#' },
                { text: '"WhoDo" We Look To Mentor', href: '#' },
              ]}
            />
            <Link
              href="/register"
              className="btn-gradient-pill"
              style={{
                display: 'block',
                marginTop: '16px',
                padding: '12px',
                background: 'linear-gradient(135deg, #191970 0%, #FF69B4 100%)',
                borderRadius: '12px',
                color: 'white',
                textAlign: 'center',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '14px',
              }}
            >
              Get Started
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
