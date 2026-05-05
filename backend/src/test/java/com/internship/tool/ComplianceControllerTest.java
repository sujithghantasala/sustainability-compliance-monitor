package com.internship.tool;

import com.internship.tool.controller.ComplianceController;
import com.internship.tool.repository.ComplianceRepository;
import com.internship.tool.service.AuditService;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class ComplianceControllerTest {

    @Test
    void testGetAll() throws Exception {

        // mock dependencies
        ComplianceRepository repo = Mockito.mock(ComplianceRepository.class);
        AuditService audit = Mockito.mock(AuditService.class);

        // create controller
        ComplianceController controller = new ComplianceController();

        // ✅ inject private fields using reflection
        ReflectionTestUtils.setField(controller, "repository", repo);
        ReflectionTestUtils.setField(controller, "auditService", audit);

        MockMvc mockMvc = MockMvcBuilders.standaloneSetup(controller).build();

        mockMvc.perform(get("/api/all"))
                .andExpect(status().isOk());
    }
}