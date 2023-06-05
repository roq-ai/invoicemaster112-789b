import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import React, { useState } from 'react';
import { Text, Box, Spinner, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Button, Link } from '@chakra-ui/react';
import { UserSelect } from 'components/user-select';
import { getReportById } from 'apiSdk/reports';
import { Error } from 'components/error';
import { ReportInterface } from 'interfaces/report';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';

function ReportViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<ReportInterface>(
    () => (id ? `/reports/${id}` : null),
    () =>
      getReportById(id, {
        relations: ['organisation'],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);
  const [createError, setCreateError] = useState(null);

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Report Detail View
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <Text fontSize="lg" fontWeight="bold" as="span">
              Title:
            </Text>
            <Text fontSize="md" as="span" ml={3}>
              {data?.title}
            </Text>
            <br />
            <Text fontSize="lg" fontWeight="bold" as="span">
              Data:
            </Text>
            <Text fontSize="md" as="span" ml={3}>
              {data?.data}
            </Text>
            <br />
            {hasAccess('organisation', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Organisation:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  <Link as={NextLink} href={`/organisations/view/${data?.organisation?.id}`}>
                    {data?.organisation?.name}
                  </Link>
                </Text>
              </>
            )}
          </>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'report',
  operation: AccessOperationEnum.READ,
})(ReportViewPage);
